import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verifications = await prisma.verification.findMany({
      include: {
        case: {
          include: { individual: true },
        },
        serviceDelivery: {
          include: {
            deliveredBy: { select: { id: true, name: true, role: true } },
            referral: { include: { provider: true } },
          },
        },
        verifiedBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { verifiedAt: 'desc' },
    });

    return NextResponse.json({ verifications });
  } catch (error: any) {
    console.error('Failed to get verifications:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role check: Only Case Managers and Administrators may verify service delivery
    if (!['ROLE_MANAGER', 'ROLE_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Permission denied: Only authorized Case Managers or Government Administrators can verify care delivery.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { serviceDeliveryId, status, remarks } = body;

    if (!serviceDeliveryId || !remarks) {
      return NextResponse.json(
        { error: 'Service Delivery ID and verification remarks are mandatory.' },
        { status: 400 }
      );
    }

    const delivery = await prisma.serviceDelivery.findUnique({
      where: { id: serviceDeliveryId },
      include: {
        case: { include: { individual: true } },
        referral: { include: { provider: true } },
      },
    });

    if (!delivery) {
      return NextResponse.json({ error: 'Service delivery record not found.' }, { status: 404 });
    }

    const verificationStatus = status || 'CONFIRMED';

    // 1. Create Verification Record
    const verification = await prisma.verification.create({
      data: {
        serviceDeliveryId,
        caseId: delivery.caseId,
        verifiedById: user.userId,
        status: verificationStatus,
        remarks,
      },
    });

    if (verificationStatus === 'CONFIRMED') {
      // 2. Mark ServiceDelivery as verified: true
      await prisma.serviceDelivery.update({
        where: { id: serviceDeliveryId },
        data: { verified: true },
      });

      // 3. Update Case status to VERIFIED
      await prisma.case.update({
        where: { id: delivery.caseId },
        data: { status: 'VERIFIED' },
      });

      // 4. Timeline
      await prisma.caseTimeline.create({
        data: {
          caseId: delivery.caseId,
          eventType: 'VERIFICATION_CONFIRMED',
          title: 'Assistance Delivery Independently Verified',
          description: `Verified by ${user.name} (${user.role}). Remarks: "${remarks}". Case is now eligible for formal closure.`,
          actorId: user.userId,
          actorRole: user.role,
        },
      });

      // 5. Notification
      await prisma.notification.create({
        data: {
          roleTarget: 'ROLE_ADMIN',
          title: 'Assistance Delivery Verified',
          message: `${delivery.serviceType} for ${delivery.case.individual.firstName} ${delivery.case.individual.lastName} verified complete.`,
          type: 'VERIFICATION',
          linkUrl: '/dashboard/admin',
        },
      });
    } else {
      // REJECTED OR PENDING DOCS
      await prisma.case.update({
        where: { id: delivery.caseId },
        data: { status: 'ESCALATED' },
      });

      await prisma.caseTimeline.create({
        data: {
          caseId: delivery.caseId,
          eventType: 'ESCALATION',
          title: 'Delivery Verification Unsatisfied',
          description: `Verification status "${verificationStatus}" logged by ${user.name}. Reason: ${remarks}. Case escalated.`,
          actorId: user.userId,
          actorRole: user.role,
        },
      });
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: user.userId,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'VERIFY',
        entity: 'SERVICE_DELIVERY',
        entityId: serviceDeliveryId,
        details: JSON.stringify({ status: verificationStatus, remarks }),
      },
    });

    return NextResponse.json({ success: true, verification }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to verify delivery:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
