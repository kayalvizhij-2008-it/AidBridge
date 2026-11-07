import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }
    if (search) {
      where.OR = [
        { caseNumber: { contains: search } },
        { title: { contains: search } },
        { individual: { firstName: { contains: search } } },
        { individual: { lastName: { contains: search } } },
      ];
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        individual: true,
        assignedManager: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, role: true } },
        organisation: { select: { id: true, name: true, type: true } },
        needsAssessments: true,
        referrals: {
          include: {
            provider: true,
            deliveries: {
              include: {
                verifications: true,
              },
            },
          },
        },
        deliveries: {
          include: {
            verifications: true,
            deliveredBy: { select: { id: true, name: true, role: true } },
          },
        },
        verifications: {
          include: {
            verifiedBy: { select: { id: true, name: true } },
          },
        },
        followUps: true,
        timelines: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error('Failed to fetch cases:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      ageCategory,
      approximateAge,
      gender,
      contactPhone,
      currentLocus,
      consentGiven,
      consentNotes,
      safeguardingFlags,
      caseTitle,
      priority,
      needsCategory,
      needsUrgency,
      needsNotes,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required.' }, { status: 400 });
    }

    // Generate readable case numbers
    const count = await prisma.case.count();
    const caseNumber = `CASE-2026-${String(count + 101).padStart(3, '0')}`;
    const individualCaseId = `AID-2026-${String(count + 1).padStart(3, '0')}`;

    // Create Individual
    const individual = await prisma.individual.create({
      data: {
        caseId: individualCaseId,
        firstName,
        lastName,
        ageCategory: ageCategory || 'ADULT',
        approximateAge: approximateAge ? parseInt(approximateAge, 10) : null,
        gender: gender || 'Undisclosed',
        contactPhone: contactPhone || 'Field Contact Only',
        currentLocus: currentLocus || 'Field Location',
        consentGiven: consentGiven !== false,
        consentNotes: consentNotes || 'Standard field consent obtained.',
        safeguardingFlags: safeguardingFlags || (ageCategory === 'CHILD' ? 'Unaccompanied minor safeguarding protocol' : null),
        registeredById: user.userId,
        orgId: user.orgId || (await prisma.organisation.findFirst())?.id || '',
      },
    });

    // Create Case
    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        individualId: individual.id,
        title: caseTitle || `Assistance for ${firstName} ${lastName}`,
        status: 'OPEN',
        priority: priority || (needsUrgency === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM'),
        createdById: user.userId,
        orgId: individual.orgId,
      },
    });

    // Create Needs Assessment if provided
    if (needsCategory) {
      await prisma.needsAssessment.create({
        data: {
          caseId: newCase.id,
          category: needsCategory,
          urgency: needsUrgency || 'MEDIUM',
          notes: needsNotes || 'Initial field assessment logged.',
          assessedById: user.userId,
        },
      });
    }

    // Create Timeline entry
    await prisma.caseTimeline.create({
      data: {
        caseId: newCase.id,
        eventType: 'REGISTRATION',
        title: 'Individual & Case Registered',
        description: `Registered by ${user.name} (${user.role}) at ${currentLocus || 'field'}. Initial needs assessed.`,
        actorId: user.userId,
        actorRole: user.role,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: user.userId,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'CREATE',
        entity: 'CASE',
        entityId: newCase.id,
        details: JSON.stringify({ caseNumber, individualName: `${firstName} ${lastName}`, priority }),
      },
    });

    return NextResponse.json({ success: true, case: newCase }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create case:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { caseId, action, status, assignedManagerId, priority, closeReason } = body;

    const id = caseId;
    if (!id) {
      return NextResponse.json({ error: 'Case ID is required.' }, { status: 400 });
    }

    const existingCase = await prisma.case.findUnique({
      where: { id },
      include: {
        referrals: {
          include: {
            deliveries: {
              include: { verifications: true },
            },
          },
        },
        deliveries: {
          include: { verifications: true },
        },
      },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // ACTION: CLOSE CASE (ENFORCE CORE RULE)
    if (action === 'CLOSE' || status === 'CLOSED') {
      if (!['ROLE_MANAGER', 'ROLE_ADMIN'].includes(user.role)) {
        return NextResponse.json(
          { error: 'Permission denied: Only authorized Case Managers or Government Administrators can close cases.' },
          { status: 403 }
        );
      }

      // CORE BUSINESS RULE: A case cannot be closed until actual service delivery is recorded & verified
      const allDeliveries = existingCase.deliveries;
      if (!allDeliveries || allDeliveries.length === 0) {
        return NextResponse.json(
          {
            error:
              'CANNOT CLOSE CASE: No service delivery has been recorded. AidBridge policy strictly requires actual recorded service delivery before case closure.',
          },
          { status: 400 }
        );
      }

      const verifiedDeliveries = allDeliveries.filter((d) => d.verified || d.verifications.some((v) => v.status === 'CONFIRMED'));
      if (verifiedDeliveries.length === 0) {
        return NextResponse.json(
          {
            error:
              'CANNOT CLOSE CASE: Service delivery has been recorded but has NOT been verified. Independent verification by an authorized Case Manager is mandatory before closure.',
          },
          { status: 400 }
        );
      }

      const updatedCase = await prisma.case.update({
        where: { id },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
          closeReason: closeReason || 'Assistance delivery verified and confirmed complete.',
        },
      });

      await prisma.caseTimeline.create({
        data: {
          caseId: id,
          eventType: 'CASE_CLOSED',
          title: 'Case Formally Closed',
          description: `Case closed by ${user.name} (${user.role}) following verified assistance delivery: ${closeReason || 'Verified complete.'}`,
          actorId: user.userId,
          actorRole: user.role,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: user.userId,
          actorEmail: user.email,
          actorRole: user.role,
          action: 'CLOSE',
          entity: 'CASE',
          entityId: id,
          details: JSON.stringify({ closeReason: closeReason || 'Verified complete' }),
        },
      });

      return NextResponse.json({ success: true, case: updatedCase });
    }

    if (assignedManagerId) {
      const updatedCase = await prisma.case.update({
        where: { id },
        data: { assignedManagerId },
      });
      return NextResponse.json({ success: true, case: updatedCase });
    }

    if (priority) {
      const updatedCase = await prisma.case.update({
        where: { id },
        data: { priority },
      });
      return NextResponse.json({ success: true, case: updatedCase });
    }

    return NextResponse.json({ error: 'No valid action specified.' }, { status: 400 });
  } catch (error: any) {
    console.error('Failed to update case:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
