import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const caseItem = await prisma.case.findUnique({
      where: { id },
      include: {
        individual: true,
        assignedManager: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, role: true } },
        organisation: true,
        needsAssessments: {
          include: { assessedBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        referrals: {
          include: {
            provider: true,
            referredBy: { select: { id: true, name: true } },
            acceptedBy: { select: { id: true, name: true } },
            deliveries: {
              include: {
                verifications: {
                  include: { verifiedBy: { select: { id: true, name: true } } },
                },
                deliveredBy: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        deliveries: {
          include: {
            verifications: {
              include: { verifiedBy: { select: { id: true, name: true } } },
            },
            deliveredBy: { select: { id: true, name: true } },
          },
        },
        verifications: {
          include: { verifiedBy: { select: { id: true, name: true } } },
        },
        followUps: {
          include: { assignedTo: { select: { id: true, name: true } } },
          orderBy: { scheduledDate: 'asc' },
        },
        timelines: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!caseItem) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ case: caseItem });
  } catch (error: any) {
    console.error('Failed to get case:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { action, status, assignedManagerId, priority, closeReason } = body;

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
      // 1. Check if user is authorized to close cases (Case Manager or Admin)
      if (!['ROLE_MANAGER', 'ROLE_ADMIN'].includes(user.role)) {
        return NextResponse.json(
          { error: 'Permission denied: Only authorized Case Managers or Government Administrators can close cases.' },
          { status: 403 }
        );
      }

      // 2. CORE BUSINESS RULE CHECK:
      // A case MUST NOT be marked completed simply because a referral was created or accepted.
      // A case can only be closed after the actual service delivery has been recorded and the required verification has been completed.
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

      // Check if there is at least one verified delivery
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

      // Update case to closed
      const updatedCase = await prisma.case.update({
        where: { id },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
          closeReason: closeReason || 'Assistance delivery verified and confirmed complete.',
        },
      });

      // Add timeline
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

      // Audit Log
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

    // ACTION: ASSIGN MANAGER
    if (assignedManagerId) {
      const updatedCase = await prisma.case.update({
        where: { id },
        data: { assignedManagerId },
      });

      await prisma.caseTimeline.create({
        data: {
          caseId: id,
          eventType: 'ASSESSMENT',
          title: 'Case Manager Assigned',
          description: `Assigned to manager ID: ${assignedManagerId}`,
          actorId: user.userId,
          actorRole: user.role,
        },
      });

      return NextResponse.json({ success: true, case: updatedCase });
    }

    // GENERAL STATUS / PRIORITY UPDATE
    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const updatedCase = await prisma.case.update({
      where: { id },
      data: updateData,
    });

    if (status === 'ESCALATED') {
      await prisma.caseTimeline.create({
        data: {
          caseId: id,
          eventType: 'ESCALATION',
          title: 'Case Priority Escalated',
          description: `Escalated to urgent intervention by ${user.name} (${user.role}).`,
          actorId: user.userId,
          actorRole: user.role,
        },
      });
    }

    return NextResponse.json({ success: true, case: updatedCase });
  } catch (error: any) {
    console.error('Failed to update case:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
