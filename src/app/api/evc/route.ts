import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'schedule') {
      const {
        applicationId,
        inspectionDate,
        mode,
        leadExpertName,
        expertPhone,
        expertEmail,
        gpsCoordinates,
        locationAddress,
      } = body;

      const schedule = await prisma.eVCSchedule.create({
        data: {
          applicationId,
          inspectionDate: new Date(inspectionDate),
          mode: mode || 'PHYSICAL',
          leadExpertName,
          expertPhone,
          expertEmail,
          gpsCoordinates,
          locationAddress,
          status: 'SCHEDULED',
        },
      });

      // Update application stage to EVC_SCHEDULED if not already
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          currentStage: 'EVC_SCHEDULED',
        },
      });

      await prisma.auditLog.create({
        data: {
          applicationId,
          action: 'EVC_INSPECTION_SCHEDULED',
          actorRole: 'RO_OFFICER',
          actorName: leadExpertName,
          details: `EVC inspection scheduled for ${new Date(inspectionDate).toLocaleDateString()} (${mode || 'PHYSICAL'}). Assigned expert: ${leadExpertName}.`,
        },
      });

      return NextResponse.json({ success: true, data: schedule });
    }

    if (action === 'complete') {
      const {
        scheduleId,
        applicationId,
        gpsCoordinates,
        reportUrl,
        inspectionSummary,
        deficienciesFound,
        isRecommended,
        actorName = 'EVC Lead Inspector',
      } = body;

      const updatedSchedule = await prisma.eVCSchedule.update({
        where: { id: scheduleId },
        data: {
          gpsCoordinates,
          reportUrl: reportUrl || 'https://docs.aicte-india.org/reports/evc_inspection_signed.pdf',
          inspectionSummary,
          deficienciesFound,
          isRecommended: Boolean(isRecommended),
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      // Advance application stage
      // If recommended -> EVC_COMPLETED
      // If not recommended -> SHC_HEARING (Standing Hearing Committee referral)
      const nextStage = isRecommended ? 'EVC_COMPLETED' : 'SHC_HEARING';

      await prisma.application.update({
        where: { id: applicationId },
        data: {
          previousStage: 'EVC_SCHEDULED',
          currentStage: nextStage,
          deficiencyCount: isRecommended ? 0 : 2,
          scrutinyRemark: isRecommended
            ? 'EVC completed with positive recommendation.'
            : `EVC Deficiencies Flagged: ${deficienciesFound || 'Norm discrepancies observed during site verification.'}`,
        },
      });

      await prisma.auditLog.create({
        data: {
          applicationId,
          action: isRecommended ? 'EVC_RECOMMENDED' : 'EVC_DEFICIENCY_REFERRED',
          stageFrom: 'EVC_SCHEDULED',
          stageTo: nextStage,
          actorRole: 'EVC_EXPERT',
          actorName,
          details: `EVC Report submitted with GPS lock [${gpsCoordinates || '26.4499,80.3319'}]. Recommendation: ${
            isRecommended ? 'RECOMMENDED FOR APPROVAL' : 'REFERRED TO SHC HEARING'
          }.`,
        },
      });

      return NextResponse.json({ success: true, data: updatedSchedule });
    }

    return NextResponse.json({ error: 'Invalid action. Supported: schedule, complete' }, { status: 400 });
  } catch (error: any) {
    console.error('EVC API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process EVC request' },
      { status: 500 }
    );
  }
}
