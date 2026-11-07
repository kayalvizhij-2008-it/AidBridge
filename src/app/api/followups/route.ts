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

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;

    const followUps = await prisma.followUp.findMany({
      where,
      include: {
        case: {
          include: { individual: true },
        },
        assignedTo: { select: { id: true, name: true, role: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    return NextResponse.json({ followUps });
  } catch (error: any) {
    console.error('Failed to get follow-ups:', error);
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
    const { caseId, scheduledDate, notes, assignedToId } = body;

    if (!caseId || !scheduledDate) {
      return NextResponse.json({ error: 'Case ID and Scheduled Date are required.' }, { status: 400 });
    }

    const followUp = await prisma.followUp.create({
      data: {
        caseId,
        scheduledDate: new Date(scheduledDate),
        notes: notes || 'Scheduled follow-up assessment.',
        assignedToId: assignedToId || user.userId,
        status: 'SCHEDULED',
      },
    });

    await prisma.caseTimeline.create({
      data: {
        caseId,
        eventType: 'FOLLOWUP_SCHEDULED',
        title: 'Follow-up Scheduled',
        description: `Scheduled for ${new Date(scheduledDate).toLocaleDateString()} by ${user.name}: "${notes || 'Routine check'}"`,
        actorId: user.userId,
        actorRole: user.role,
      },
    });

    return NextResponse.json({ success: true, followUp }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create follow-up:', error);
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
    const { followUpId, outcome, status } = body;

    if (!followUpId) {
      return NextResponse.json({ error: 'Follow-up ID is required.' }, { status: 400 });
    }

    const followUp = await prisma.followUp.update({
      where: { id: followUpId },
      data: {
        outcome,
        status: status || 'COMPLETED',
        completedAt: new Date(),
      },
    });

    await prisma.caseTimeline.create({
      data: {
        caseId: followUp.caseId,
        eventType: 'FOLLOWUP_COMPLETED',
        title: 'Follow-up Assessment Completed',
        description: `Outcome recorded by ${user.name}: "${outcome || 'Completed successfully'}"`,
        actorId: user.userId,
        actorRole: user.role,
      },
    });

    return NextResponse.json({ success: true, followUp });
  } catch (error: any) {
    console.error('Failed to update follow-up:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
