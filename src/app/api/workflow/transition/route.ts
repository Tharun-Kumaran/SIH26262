import { NextResponse } from 'next/server';
import { processWorkflowTransition } from '@/lib/workflow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicationId, targetStage, actorRole, actorName, deficiencyReason, approvalDecision } = body;

    if (!applicationId || !targetStage || !actorRole || !actorName) {
      return NextResponse.json(
        { error: 'Missing required parameters: applicationId, targetStage, actorRole, actorName' },
        { status: 400 }
      );
    }

    const result = await processWorkflowTransition({
      applicationId,
      targetStage,
      actorRole,
      actorName,
      deficiencyReason,
      approvalDecision,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully transitioned to ${targetStage}`,
      data: result,
    });
  } catch (error: any) {
    console.error('Workflow transition error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}
