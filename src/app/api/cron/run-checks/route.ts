import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return handleCronScan(request);
}

export async function GET(request: Request) {
  return handleCronScan(request);
}

async function handleCronScan(request: Request) {
  try {
    let fastForwardDays = 0;
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        fastForwardDays = Number(body.fastForwardDays) || 0;
      } catch {
        // query param fallback
      }
    }

    const { searchParams } = new URL(request.url);
    if (!fastForwardDays && searchParams.has('fastForwardDays')) {
      fastForwardDays = Number(searchParams.get('fastForwardDays')) || 0;
    }

    const now = new Date();
    // Effective current date under fast-forward simulation
    const effectiveNow = new Date(now.getTime() + fastForwardDays * 24 * 60 * 60 * 1000);

    const report = {
      timestamp: effectiveNow.toISOString(),
      fastForwardDaysApplied: fastForwardDays,
      scannedApplications: 0,
      slaBreachesDetected: 0,
      escalatedToHQ: 0,
      expiringDocumentsDetected: 0,
      overdueUndertakingsDetected: 0,
      details: [] as string[],
    };

    // 1. Scan active applications
    const activeApplications = await prisma.application.findMany({
      where: {
        currentStage: {
          notIn: ['LOA_GRANTED', 'EOA_GRANTED', 'EOA_3YEAR_GRANTED', 'APPROVED', 'REJECTED'],
        },
      },
      include: { institution: true },
    });

    report.scannedApplications = activeApplications.length;

    for (const app of activeApplications) {
      const isBreached = effectiveNow.getTime() > new Date(app.slaDeadline).getTime();
      let updatedAgeing = app.ageingDays + fastForwardDays;
      let newEscalationLevel = app.escalationLevel;
      let stateChanged = false;

      if (isBreached) {
        report.slaBreachesDetected++;
        if (!app.isOverdue) {
          stateChanged = true;
        }

        // Escalation rules:
        // Overdue by > 2 days -> Level 2 (REGULATION_BUREAU_ADMIN)
        // Overdue by <= 2 days -> Level 1 (RO Warning)
        const daysOver = Math.ceil(
          (effectiveNow.getTime() - new Date(app.slaDeadline).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysOver > 2 && app.escalationLevel < 2) {
          newEscalationLevel = 2;
          report.escalatedToHQ++;
          stateChanged = true;

          // Record HQ Escalation Audit Log
          await prisma.auditLog.create({
            data: {
              applicationId: app.id,
              action: 'ESCALATED_TO_HQ',
              stageFrom: app.currentStage,
              stageTo: app.currentStage,
              actorRole: 'SYSTEM_CRON',
              actorName: 'AICTE Escalation Engine',
              details: `Application ${app.applicationNo} exceeded SLA by ${daysOver} days in ${app.currentStage}. Escalated to REGULATION_BUREAU_ADMIN.`,
              timestamp: effectiveNow,
            },
          });
          report.details.push(
            `Escalated ${app.applicationNo} (${app.institution.name}) to HQ due to ${daysOver} days SLA breach.`
          );
        } else if (app.escalationLevel === 0) {
          newEscalationLevel = 1;
          stateChanged = true;

          await prisma.auditLog.create({
            data: {
              applicationId: app.id,
              action: 'SLA_BREACH_DETECTED',
              stageFrom: app.currentStage,
              stageTo: app.currentStage,
              actorRole: 'SYSTEM_CRON',
              actorName: 'AICTE SLA Monitoring Engine',
              details: `SLA breach detected for ${app.applicationNo}. Target deadline was ${app.slaDeadline.toISOString().split('T')[0]}.`,
              timestamp: effectiveNow,
            },
          });
          report.details.push(`SLA breach flagged for ${app.applicationNo} in ${app.currentStage}.`);
        }
      }

      // Update app record if fast forward or escalation occurred
      if (stateChanged || fastForwardDays > 0) {
        await prisma.application.update({
          where: { id: app.id },
          data: {
            isOverdue: isBreached,
            escalationLevel: newEscalationLevel,
            ageingDays: updatedAgeing,
          },
        });
      }
    }

    // 2. Scan Document Expiries (T-90, T-30, T-15, T-7, T-5, Overdue)
    const documents = await prisma.document.findMany({
      where: {
        expiryDate: { not: null },
      },
      include: { institution: true, application: true },
    });

    for (const doc of documents) {
      if (!doc.expiryDate) continue;
      const expiry = new Date(doc.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - effectiveNow.getTime()) / (1000 * 60 * 60 * 24));

      let docExpiringSoon = false;
      let newStatus = doc.verificationStatus;

      if (diffDays <= 0) {
        newStatus = 'EXPIRED';
        docExpiringSoon = true;
        report.expiringDocumentsDetected++;
        report.details.push(
          `Document '${doc.documentTitle}' for ${doc.institution.name} has EXPIRED (${Math.abs(diffDays)} days ago).`
        );
      } else if (diffDays <= 15) {
        docExpiringSoon = true;
        report.expiringDocumentsDetected++;
        report.details.push(
          `Document '${doc.documentTitle}' for ${doc.institution.name} is expiring in ${diffDays} days.`
        );
      }

      if (doc.isExpiringSoon !== docExpiringSoon || doc.verificationStatus !== newStatus) {
        await prisma.document.update({
          where: { id: doc.id },
          data: {
            isExpiringSoon: docExpiringSoon,
            verificationStatus: newStatus,
          },
        });
      }
    }

    // 3. Scan Time-Bound Undertakings (Affidavit-2)
    const undertakings = await prisma.undertaking.findMany({
      where: {
        fulfilmentStatus: { in: ['PENDING', 'OVERDUE'] },
      },
      include: { institution: true },
    });

    for (const un of undertakings) {
      const due = new Date(un.dueDate);
      const diffDays = Math.ceil((due.getTime() - effectiveNow.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        report.overdueUndertakingsDetected++;
        if (un.fulfilmentStatus !== 'OVERDUE' || un.escalationLevel < 2) {
          await prisma.undertaking.update({
            where: { id: un.id },
            data: {
              fulfilmentStatus: 'OVERDUE',
              escalationLevel: 2,
            },
          });

          await prisma.auditLog.create({
            data: {
              applicationId: un.applicationId,
              action: 'UNDERTAKING_BREACH_DETECTED',
              actorRole: 'SYSTEM_CRON',
              actorName: 'AICTE Compliance Engine',
              details: `Undertaking '${un.title}' breached deadline (${Math.abs(diffDays)} days overdue). Auto-escalated with Show Cause notice.`,
              timestamp: effectiveNow,
            },
          });
          report.details.push(
            `Undertaking '${un.title}' overdue by ${Math.abs(diffDays)} days for ${un.institution.name}.`
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message:
        fastForwardDays > 0
          ? `Cron scan executed with +${fastForwardDays} Days Fast-Forward simulation!`
          : 'Regular AICTE Cron compliance scan executed successfully.',
      report,
    });
  } catch (error: any) {
    console.error('Cron check execution error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
