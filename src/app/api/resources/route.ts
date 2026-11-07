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
    const type = searchParams.get('type');

    const where: any = {};
    if (type && type !== 'ALL') where.type = type;

    const providers = await prisma.serviceProvider.findMany({
      where,
      include: {
        organisation: true,
        resources: true,
        referrals: {
          where: { status: 'PENDING' },
          select: { id: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ providers });
  } catch (error: any) {
    console.error('Failed to get resources:', error);
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
    const { providerId, resourceId, capacityAvailable, availableCount } = body;

    if (providerId && capacityAvailable !== undefined) {
      const updated = await prisma.serviceProvider.update({
        where: { id: providerId },
        data: { capacityAvailable: parseInt(capacityAvailable, 10) },
      });
      return NextResponse.json({ success: true, provider: updated });
    }

    if (resourceId && availableCount !== undefined) {
      const updatedResource = await prisma.resource.update({
        where: { id: resourceId },
        data: { availableCount: parseInt(availableCount, 10) },
      });
      return NextResponse.json({ success: true, resource: updatedResource });
    }

    return NextResponse.json({ error: 'Missing update parameters.' }, { status: 400 });
  } catch (error: any) {
    console.error('Failed to update resource:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
