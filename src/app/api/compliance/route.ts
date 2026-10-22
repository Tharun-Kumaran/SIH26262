import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'verify-document') {
      const {
        documentId,
        verificationStatus,
        deficiencyRemarks,
        actorName = 'Scrutiny Officer',
      } = body;

      const doc = await prisma.document.update({
        where: { id: documentId },
        data: {
          verificationStatus,
          deficiencyRemarks: deficiencyRemarks || null,
          verifiedBy: actorName,
          verifiedAt: new Date(),
        },
      });

      if (doc.applicationId) {
        await prisma.auditLog.create({
          data: {
            applicationId: doc.applicationId,
            action: verificationStatus === 'VERIFIED' ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_DEFICIENT',
            actorRole: 'SCRUTINY_COMMITTEE',
            actorName,
            details: `Document '${doc.documentTitle}' marked as ${verificationStatus}.${
              deficiencyRemarks ? ` Remarks: ${deficiencyRemarks}` : ''
            }`,
          },
        });
      }

      return NextResponse.json({ success: true, data: doc });
    }

    if (action === 'fulfill-undertaking') {
      const {
        undertakingId,
        complianceProofUrl,
        remarks,
        actorName = 'Institute Representative',
      } = body;

      const updated = await prisma.undertaking.update({
        where: { id: undertakingId },
        data: {
          fulfilmentStatus: 'FULFILLED',
          complianceProofUrl: complianceProofUrl || 'https://docs.aicte-india.org/proofs/compliance_affidavit2.pdf',
          remarks: remarks || 'Compliance proof submitted by Institute PID holder.',
        },
      });

      if (updated.applicationId) {
        await prisma.auditLog.create({
          data: {
            applicationId: updated.applicationId,
            action: 'UNDERTAKING_COMPLIANCE_UPLOADED',
            actorRole: 'INSTITUTE_USER',
            actorName,
            details: `Compliance proof uploaded for '${updated.title}'. Status updated to FULFILLED.`,
          },
        });
      }

      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ error: 'Invalid action. Supported: verify-document, fulfill-undertaking' }, { status: 400 });
  } catch (error: any) {
    console.error('Compliance API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update compliance' },
      { status: 500 }
    );
  }
}
