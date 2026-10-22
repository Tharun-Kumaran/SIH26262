import { prisma } from './prisma';

export interface TransitionRequest {
  applicationId: string;
  targetStage: string;
  actorRole: string;
  actorName: string;
  actorEmail?: string;
  deficiencyReason?: string;
  approvalDecision?: 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
  ipAddress?: string;
}

export async function canRoleTransition(
  actorRole: string,
  currentStage: string,
  targetStage: string
): Promise<{ allowed: boolean; reason?: string }> {
  // REGULATION_BUREAU_ADMIN has super-user override permissions across all stages
  if (actorRole === 'REGULATION_BUREAU_ADMIN') {
    return { allowed: true };
  }

  // RO_OFFICER permissions
  if (actorRole === 'RO_OFFICER') {
    if (['SUBMITTED', 'EVC_COMPLETED'].includes(currentStage)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: `RO_OFFICER can only process SUBMITTED or post-EVC applications. Current stage is ${currentStage}.`,
    };
  }

  // SCRUTINY_COMMITTEE permissions
  if (actorRole === 'SCRUTINY_COMMITTEE') {
    if (['SCRUTINY', 'RE_SCRUTINY'].includes(currentStage)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: `SCRUTINY_COMMITTEE can only operate on SCRUTINY or RE_SCRUTINY stages. Current stage is ${currentStage}.`,
    };
  }

  // EVC_EXPERT permissions
  if (actorRole === 'EVC_EXPERT') {
    if (['EVC_SCHEDULED'].includes(currentStage)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: `EVC_EXPERT can only inspect when stage is EVC_SCHEDULED. Current stage is ${currentStage}.`,
    };
  }

  // SHC_SAC_COMMITTEE permissions
  if (actorRole === 'SHC_SAC_COMMITTEE') {
    if (['SHC_HEARING', 'SAC_APPEAL'].includes(currentStage)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: `SHC_SAC_COMMITTEE can only handle SHC_HEARING or SAC_APPEAL stages. Current stage is ${currentStage}.`,
    };
  }

  return {
    allowed: false,
    reason: `Role ${actorRole} does not have authority to transition application from ${currentStage}.`,
  };
}

export async function processWorkflowTransition(req: TransitionRequest) {
  const {
    applicationId,
    targetStage,
    actorRole,
    actorName,
    deficiencyReason,
    approvalDecision,
    ipAddress = '127.0.0.1',
  } = req;

  // 1. Fetch current application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { institution: true },
  });

  if (!application) {
    throw new Error(`Application with ID ${applicationId} not found.`);
  }

  const currentStage = application.currentStage;
  const aphTrack = application.aphTrack;

  // 2. Role permission check
  const roleCheck = await canRoleTransition(actorRole, currentStage, targetStage);
  if (!roleCheck.allowed) {
    throw new Error(roleCheck.reason || 'Unauthorized role for this transition');
  }

  // 3. WorkflowRule transition validation
  const rule = await prisma.workflowRule.findFirst({
    where: {
      aphTrack,
      stage: currentStage,
      isActive: true,
    },
  });

  if (rule) {
    const allowedTransitions: string[] = JSON.parse(rule.allowedTransitions || '[]');
    if (!allowedTransitions.includes(targetStage)) {
      throw new Error(
        `Transition from ${currentStage} to ${targetStage} is not permitted for track ${aphTrack}. Allowed: ${allowedTransitions.join(', ')}`
      );
    }
  }

  // 4. If reverting for re-scrutiny, deficiency reason is mandatory
  if (targetStage === 'RE_SCRUTINY' && (!deficiencyReason || deficiencyReason.trim().length < 5)) {
    throw new Error('Mandatory deficiency reason required when reverting an application to RE_SCRUTINY.');
  }

  // 5. Calculate new SLA deadline based on targetStage's rule
  const targetRule = await prisma.workflowRule.findFirst({
    where: {
      aphTrack,
      stage: targetStage,
      isActive: true,
    },
  });

  const slaDays = targetRule ? targetRule.slaDays : 7;
  const now = new Date();
  const newSlaDeadline = new Date(now.getTime() + slaDays * 24 * 60 * 60 * 1000);

  // 6. Update application
  const updatedApp = await prisma.application.update({
    where: { id: applicationId },
    data: {
      previousStage: currentStage,
      currentStage: targetStage,
      stageStartedAt: now,
      slaDaysAllocated: slaDays,
      slaDeadline: newSlaDeadline,
      isOverdue: false,
      escalationLevel: 0,
      deficiencyCount:
        targetStage === 'RE_SCRUTINY' ? application.deficiencyCount + 1 : application.deficiencyCount,
      scrutinyRemark: deficiencyReason || application.scrutinyRemark,
      approvalDecision: approvalDecision || application.approvalDecision,
    },
  });

  // 7. Write immutable AuditLog
  const actionType =
    targetStage === 'RE_SCRUTINY'
      ? 'DEFICIENCY_MARKED'
      : targetStage.includes('GRANTED') || targetStage === 'APPROVED'
      ? 'APPLICATION_APPROVED'
      : targetStage === 'REJECTED'
      ? 'APPLICATION_REJECTED'
      : 'STAGE_TRANSITION';

  const details =
    targetStage === 'RE_SCRUTINY'
      ? `Reverted to Re-Scrutiny. Deficiency Tag: ${deficiencyReason}. SLA reset to ${slaDays} days.`
      : `Transitioned from ${currentStage} to ${targetStage} by ${actorName} (${actorRole}). New SLA allocated: ${slaDays} days.`;

  const auditEntry = await prisma.auditLog.create({
    data: {
      applicationId,
      action: actionType,
      stageFrom: currentStage,
      stageTo: targetStage,
      actorRole,
      actorName,
      ipAddress,
      details,
      timestamp: now,
    },
  });

  return { application: updatedApp, auditLog: auditEntry };
}
