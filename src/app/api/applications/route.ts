import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const stage = searchParams.get('stage');
    const track = searchParams.get('track');
    const pid = searchParams.get('pid');
    const search = searchParams.get('search');

    const where: any = {};

    if (stage) where.currentStage = stage;
    if (track) where.aphTrack = track;

    if (region && region !== 'HQ' && region !== 'ALL') {
      where.institution = { region };
    }

    if (pid) {
      where.institution = { ...where.institution, aictePid: pid };
    }

    if (search) {
      where.OR = [
        { applicationNo: { contains: search } },
        { institution: { name: { contains: search } } },
        { institution: { aictePid: { contains: search } } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        institution: true,
        documents: true,
        undertakings: true,
        evcSchedules: true,
        auditLogs: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { isOverdue: 'desc' },
        { escalationLevel: 'desc' },
        { submittedAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: applications });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
