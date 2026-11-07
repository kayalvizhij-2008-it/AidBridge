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
    const providerId = searchParams.get('providerId');
    const status = searchParams.get('status');

    const where: any = {};
    if (providerId) where.providerId = providerId;
    if (status && status !== 'ALL') where.status = status;

    const referrals = await prisma.referral.findMany({
      where,
      include: {
        case: {
          include: {
            individual: true,
            needsAssessments: true,
          },
        },
        provider: true,
        referredBy: { select: { id: true, name: true, role: true } },
        acceptedBy: { select: { id: true, name: true, role: true } },
        deliveries: {
          include: { verifications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ referrals });
  } catch (error: any) {
    console.error('Failed to get referrals:', error);
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
    const { caseId, providerId, requestedService, priority, notes } = body;

    if (!caseId || !providerId || !requestedService) {
      return NextResponse.json({ error: 'Case ID, Provider ID, and Requested Service are required.' }, { status: 400 });
    }

    const provider = await prisma.serviceProvider.findUnique({ where: { id: providerId } });
    if (!provider) {
      return NextResponse.json({ error: 'Service Provider not found' }, { status: 404 });
    }

    const referral = await prisma.referral.create({
      data: {
        caseId,
        providerId,
        requestedService,
        priority: priority || 'MEDIUM',
        status: 'PENDING',
        notes: notes || 'New service coordination referral dispatched.',
        referredById: user.userId,
      },
    });

    // Update Case status to REFERRED
    await prisma.case.update({
      where: { id: caseId },
      data: { status: 'REFERRED' },
    });

    // Add Timeline Entry
    await prisma.caseTimeline.create({
      data: {
        caseId,
        eventType: 'REFERRAL_SENT',
        title: `Referral Dispatched: ${requestedService}`,
        description: `Referred to ${provider.name} by ${user.name} (${user.role}). Priority: ${priority || 'MEDIUM'}.`,
        actorId: user.userId,
        actorRole: user.role,
      },
    });

    // Create Notification for the provider role
    const targetRole = provider.type === 'SHELTER' ? 'ROLE_SHELTER' : provider.type === 'CLINIC_HOSPITAL' ? 'ROLE_HOSPITAL' : 'ROLE_ADMIN';
    await prisma.notification.create({
      data: {
        roleTarget: targetRole,
        title: `Incoming ${provider.type} Referral`,
        message: `New referral for ${requestedService} assigned to ${provider.name}.`,
        type: 'REFERRAL',
        linkUrl: targetRole === 'ROLE_SHELTER' ? '/dashboard/shelter' : '/dashboard/hospital',
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: user.userId,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'CREATE',
        entity: 'REFERRAL',
        entityId: referral.id,
        details: JSON.stringify({ caseId, providerName: provider.name, requestedService }),
      },
    });

    return NextResponse.json({ success: true, referral }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create referral:', error);
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
    const { referralId, action, rejectionReason, notes } = body;

    if (!referralId || !action) {
      return NextResponse.json({ error: 'Referral ID and Action are required.' }, { status: 400 });
    }

    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: { provider: true, case: true },
    });

    if (!referral) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }

    if (action === 'ACCEPT') {
      const updated = await prisma.referral.update({
        where: { id: referralId },
        data: {
          status: 'ACCEPTED',
          acceptedById: user.userId,
          respondedAt: new Date(),
          notes: notes || referral.notes,
        },
      });

      // Update case to IN_PROGRESS
      await prisma.case.update({
        where: { id: referral.caseId },
        data: { status: 'IN_PROGRESS' },
      });

      await prisma.caseTimeline.create({
        data: {
          caseId: referral.caseId,
          eventType: 'REFERRAL_ACCEPTED',
          title: `Referral Accepted: ${referral.requestedService}`,
          description: `Accepted by ${user.name} (${user.role}) at ${referral.provider.name}. Service intake underway.`,
          actorId: user.userId,
          actorRole: user.role,
        },
      });

      // Notify Case Manager
      await prisma.notification.create({
        data: {
          roleTarget: 'ROLE_MANAGER',
          title: 'Referral Accepted by Provider',
          message: `${referral.provider.name} accepted referral for ${referral.requestedService}. Service intake in progress.`,
          type: 'REFERRAL',
          linkUrl: '/dashboard/manager',
        },
      });

      return NextResponse.json({ success: true, referral: updated });
    }

    if (action === 'REJECT') {
      if (!rejectionReason || rejectionReason.trim().length === 0) {
        return NextResponse.json(
          { error: 'A documented rejection reason is strictly mandatory under AidBridge governance.' },
          { status: 400 }
        );
      }

      const updated = await prisma.referral.update({
        where: { id: referralId },
        data: {
          status: 'REJECTED',
          rejectionReason,
          respondedAt: new Date(),
        },
      });

      await prisma.caseTimeline.create({
        data: {
          caseId: referral.caseId,
          eventType: 'REFERRAL_REJECTED',
          title: `Referral Rejected: ${referral.requestedService}`,
          description: `Provider ${referral.provider.name} rejected referral. Reason: ${rejectionReason}`,
          actorId: user.userId,
          actorRole: user.role,
        },
      });

      // Escalate to Case Manager
      await prisma.notification.create({
        data: {
          roleTarget: 'ROLE_MANAGER',
          title: 'ACTION REQUIRED: Referral Rejected',
          message: `Referral to ${referral.provider.name} was rejected: ${rejectionReason}. Re-routing required.`,
          type: 'ESCALATION',
          linkUrl: '/dashboard/manager',
        },
      });

      return NextResponse.json({ success: true, referral: updated });
    }

    return NextResponse.json({ error: 'Unsupported referral action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Failed to update referral:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
