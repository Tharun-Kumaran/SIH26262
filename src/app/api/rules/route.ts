import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rules = await prisma.workflowRule.findMany({
      orderBy: [{ aphTrack: 'asc' }, { stage: 'asc' }],
    });
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch rules' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, slaDays, allowedTransitions, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (slaDays !== undefined) data.slaDays = Number(slaDays);
    if (allowedTransitions !== undefined) {
      data.allowedTransitions =
        typeof allowedTransitions === 'string'
          ? allowedTransitions
          : JSON.stringify(allowedTransitions);
    }
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const updated = await prisma.workflowRule.update({
      where: { id },
      data,
    });

    // Record Audit Log for SLA rule modification
    await prisma.auditLog.create({
      data: {
        action: 'SLA_RULE_UPDATED',
        actorRole: 'REGULATION_BUREAU_ADMIN',
        actorName: 'AICTE HQ Policy Administrator',
        details: `Updated SLA for track ${updated.aphTrack} stage ${updated.stage} to ${updated.slaDays} days.`,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update rule' },
      { status: 500 }
    );
  }
}
