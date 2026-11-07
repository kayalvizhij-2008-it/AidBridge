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
    const caseId = searchParams.get('caseId');

    const where: any = {};
    if (caseId) where.caseId = caseId;

    const deliveries = await prisma.serviceDelivery.findMany({
      where,
      include: {
        case: {
          include: { individual: true },
        },
        referral: {
          include: { provider: true },
        },
        deliveredBy: { select: { id: true, name: true, role: true } },
        verifications: {
          include: { verifiedBy: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ deliveries });
  } catch (error: any) {
    console.error('Failed to get deliveries:', error);
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
    const { referralId, serviceType, evidenceNotes, locationNotes } = body;

    if (!referralId || !serviceType || !evidenceNotes) {
      return NextResponse.json(
        { error: 'Referral ID, Service Type, and Evidence Notes are required to record delivery.' },
        { status: 400 }
      );
    }

    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: { provider: true, case: { include: { individual: true } } },
    });

    if (!referral) {
      return NextResponse.json({ error: 'Referral not found.' }, { status: 404 });
    }

    // Create Service Delivery Record
    const delivery = await prisma.serviceDelivery.create({
      data: {
        referralId,
        caseId: referral.caseId,
        serviceType,
        deliveredById: user.userId,
        evidenceNotes,
        locationNotes: locationNotes || referral.provider.name,
        verified: false,
      },
    });

    // Mark referral status as COMPLETED
    await prisma.referral.update({
      where: { id: referralId },
      data: { status: 'COMPLETED' },
    });

    // Move case to PENDING_VERIFICATION (Critical business state)
    await prisma.case.update({
      where: { id: referral.caseId },
      data: { status: 'PENDING_VERIFICATION' },
    });

    // Add Timeline
    await prisma.caseTimeline.create({
      data: {
        caseId: referral.caseId,
        eventType: 'SERVICE_DELIVERED',
        title: `Service Delivered: ${serviceType}`,
        description: `Delivered by ${user.name} (${user.role}) at ${locationNotes || referral.provider.name}. Evidence recorded: "${evidenceNotes}". Awaiting manager verification.`,
        actorId: user.userId,
        actorRole: user.role,
      },
    });

    // Notification for Case Managers
    await prisma.notification.create({
      data: {
        roleTarget: 'ROLE_MANAGER',
        title: 'Delivery Verification Required',
        message: `${serviceType} delivered to ${referral.case.individual.firstName} ${referral.case.individual.lastName}. Confirm verification before case closure.`,
        type: 'VERIFICATION',
        linkUrl: '/dashboard/manager',
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: user.userId,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'CREATE',
        entity: 'SERVICE_DELIVERY',
        entityId: delivery.id,
        details: JSON.stringify({ serviceType, locationNotes, evidenceNotes }),
      },
    });

    return NextResponse.json({ success: true, delivery }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to record delivery:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
