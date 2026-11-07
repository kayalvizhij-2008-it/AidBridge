import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalCases,
      activeCases,
      closedCases,
      pendingVerificationCases,
      escalatedCases,
      totalReferrals,
      pendingReferrals,
      acceptedReferrals,
      rejectedReferrals,
      totalDeliveries,
      verifiedDeliveries,
      overdueFollowUps,
      totalIndividuals,
      providers,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.case.count(),
      prisma.case.count({ where: { status: { in: ['OPEN', 'REFERRED', 'IN_PROGRESS'] } } }),
      prisma.case.count({ where: { status: 'CLOSED' } }),
      prisma.case.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.case.count({ where: { status: 'ESCALATED' } }),
      prisma.referral.count(),
      prisma.referral.count({ where: { status: 'PENDING' } }),
      prisma.referral.count({ where: { status: { in: ['ACCEPTED', 'COMPLETED'] } } }),
      prisma.referral.count({ where: { status: 'REJECTED' } }),
      prisma.serviceDelivery.count(),
      prisma.serviceDelivery.count({ where: { verified: true } }),
      prisma.followUp.count({ where: { status: 'OVERDUE' } }),
      prisma.individual.count(),
      prisma.serviceProvider.findMany({
        include: {
          resources: true,
          organisation: { select: { name: true, type: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Resource utilization
    const resourceSummary = providers.map((p) => {
      const totalCap = p.capacityTotal || 0;
      const availCap = p.capacityAvailable || 0;
      const usedCap = Math.max(0, totalCap - availCap);
      const utilPercent = totalCap > 0 ? Math.round((usedCap / totalCap) * 100) : 0;
      return {
        id: p.id,
        name: p.name,
        type: p.type,
        total: totalCap,
        available: availCap,
        utilized: usedCap,
        percent: utilPercent,
      };
    });

    // Verification rate
    const verificationRate =
      totalDeliveries > 0 ? Math.round((verifiedDeliveries / totalDeliveries) * 100) : 100;

    return NextResponse.json({
      summary: {
        totalCases,
        activeCases,
        closedCases,
        pendingVerificationCases,
        escalatedCases,
        totalReferrals,
        pendingReferrals,
        acceptedReferrals,
        rejectedReferrals,
        totalDeliveries,
        verifiedDeliveries,
        overdueFollowUps,
        totalIndividuals,
        verificationRate,
      },
      resourceSummary,
      recentAuditLogs,
    });
  } catch (error: any) {
    console.error('Failed to get analytics:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
