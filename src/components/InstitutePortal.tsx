'use client';

import React, { useState } from 'react';
import {
  School,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UploadCloud,
  FileText,
  Calendar,
  Building2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { STAGE_LABELS, DOCUMENT_CATEGORIES } from '@/lib/types';

import { Role } from '@/lib/types';

interface InstitutePortalProps {
  applications: any[];
  onRefresh: () => void;
  currentRole?: Role;
}

export const InstitutePortal: React.FC<InstitutePortalProps> = ({
  applications,
  onRefresh,
  currentRole = 'INSTITUTE_USER',
}) => {
  // If role is INSTITUTE_USER, strictly isolate to Madras Institute of Technology (PID 1-1029384751)
  const userInstituteApp =
    applications.find((a) => a.institution?.aictePid === '1-1029384751') ||
    applications[0];

  const [selectedAppId, setSelectedAppId] = useState<string>(
    currentRole === 'INSTITUTE_USER' ? userInstituteApp?.id || '' : applications[0]?.id || ''
  );

  const activeApp =
    currentRole === 'INSTITUTE_USER'
      ? userInstituteApp
      : applications.find((a) => a.id === selectedAppId) || applications[0];
  const institution = activeApp?.institution;

  const [selectedUndertaking, setSelectedUndertaking] = useState<any>(null);
  const [proofUrl, setProofUrl] = useState<string>(
    'https://docs.aicte-india.org/proofs/compliance_affidavit2_signed.pdf'
  );
  const [proofRemarks, setProofRemarks] = useState<string>(
    'Faculty selection committee board minutes uploaded with appointment orders.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  const expiringDocs = (activeApp?.documents || []).filter(
    (d: any) => d.isExpiringSoon || d.verificationStatus === 'EXPIRED'
  );

  const pipelineStages = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'SCRUTINY', label: 'Scrutiny' },
    { key: 'RE_SCRUTINY', label: 'Re-Scrutiny' },
    { key: 'EVC_SCHEDULED', label: 'EVC' },
    { key: 'EVC_COMPLETED', label: 'EVC Done' },
    { key: 'SHC_HEARING', label: 'Hearing' },
    { key: 'LOA_GRANTED', label: 'Approved' },
  ];

  const getStageIndex = (stage: string) => {
    if (['LOA_GRANTED', 'EOA_GRANTED', 'EOA_3YEAR_GRANTED', 'APPROVED'].includes(stage)) return 6;
    if (stage === 'SHC_HEARING' || stage === 'SAC_APPEAL') return 5;
    if (stage === 'EVC_COMPLETED') return 4;
    if (stage === 'EVC_SCHEDULED') return 3;
    if (stage === 'RE_SCRUTINY') return 2;
    if (stage === 'SCRUTINY') return 1;
    return 0;
  };

  const currentStageIndex = getStageIndex(activeApp?.currentStage || 'SUBMITTED');

  const handleFulfillUndertaking = async () => {
    if (!selectedUndertaking) return;
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fulfill-undertaking',
          undertakingId: selectedUndertaking.id,
          complianceProofUrl: proofUrl,
          remarks: proofRemarks,
          actorName: `Institute User (PID: ${institution?.aictePid || '1-1029384751'})`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedUndertaking(null);
        setUploadSuccessToast('Compliance proof submitted for regional review.');
        setTimeout(() => setUploadSuccessToast(null), 4000);
        onRefresh();
      }
    } catch {
      alert('Failed to submit compliance proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1216px] mx-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
            {currentRole === 'INSTITUTE_USER'
              ? 'Institute Compliance & Approval Pipeline'
              : 'Institutional Compliance & Approvals Tracking'}
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            Permanent Institute ID status, Affidavit-2 time-bound conditions, and statutory document lifecycle
          </p>
        </div>

        {/* Institution Selector / Role Isolation Badge */}
        {currentRole === 'INSTITUTE_USER' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#EBF3FB] border border-[#C5DCFA] text-[12px] text-[#245A91] font-medium shadow-xs">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>PID: {institution?.aictePid || '1-1029384751'} ({institution?.name || 'Madras Institute of Technology'})</span>
            <span className="text-[10px] bg-[#142B49] text-white px-1.5 py-0.2 rounded font-mono">SCOPED</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#5E6C84]">Switch Institution:</span>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="px-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  PID: {app.institution?.aictePid} - {app.institution?.name.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {uploadSuccessToast && (
        <div className="px-3 py-1.5 rounded bg-[#EFF8F3] border border-[#BDE3CF] text-[#1E7E45] text-[12px] font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{uploadSuccessToast}</span>
        </div>
      )}

      {/* Critical Expiry Alerts (if any) */}
      {expiringDocs.length > 0 && (
        <div className="enterprise-panel p-3.5 border-l-4 border-l-[#DC2626]">
          <div className="flex items-center justify-between pb-1 mb-2">
            <span className="text-[12px] font-semibold text-[#DC2626] uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
              Statutory Expiry Warning: Mandatory APH Documents
            </span>
            <span className="text-[11px] text-[#8993A4]">Renewal mandatory</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {expiringDocs.map((doc: any) => {
              const isExpired = doc.verificationStatus === 'EXPIRED';
              return (
                <div
                  key={doc.id}
                  className="p-2.5 rounded bg-[#FAFBFC] border border-[#DDE1E5] flex items-start justify-between"
                >
                  <div>
                    <div className="text-[12px] font-medium text-[#172B4D]">
                      {doc.documentTitle}
                    </div>
                    <div className="text-[11px] text-[#5E6C84] font-mono mt-0.5">
                      Doc No: {doc.documentNumber || 'Pending'}
                    </div>
                    {doc.expiryDate && (
                      <div className="text-[11px] text-[#DC2626] font-medium mt-1">
                        Expiry Date: {new Date(doc.expiryDate).toLocaleDateString()}
                        {isExpired ? ' (Expired)' : ' (Expiring within statutory window)'}
                      </div>
                    )}
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase shrink-0 ${
                      isExpired
                        ? 'bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2]'
                        : 'bg-[#FEF6E7] text-[#9A6208] border border-[#FDE6B8]'
                    }`}
                  >
                    {isExpired ? 'EXPIRED' : 'EXPIRING SOON'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Pipeline Tracker */}
      <div className="enterprise-panel p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F4]">
          <div>
            <h2 className="text-[13px] font-semibold text-[#172B4D]">
              Approval Process Handbook (APH 2024-27) Workflow Stage
            </h2>
            <div className="text-[12px] text-[#5E6C84] mt-0.5">
              Application No: <span className="font-mono text-[#172B4D]">{activeApp?.applicationNo}</span> •{' '}
              Track: <span className="text-[#245A91] font-mono">{activeApp?.aphTrack}</span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded bg-[#EFF5FB] border border-[#D3DFED] text-[#245A91] text-[12px] font-medium font-mono">
            {STAGE_LABELS[activeApp?.currentStage] || activeApp?.currentStage}
          </span>
        </div>

        {/* Clean Linear Pipeline */}
        <div className="py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#DDE1E5] -z-0" />
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#245A91] -z-0 transition-all duration-300"
              style={{
                width: `${(currentStageIndex / (pipelineStages.length - 1)) * 100}%`,
              }}
            />

            {pipelineStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                      isPast
                        ? 'bg-[#1E7E45] text-white'
                        : isCurrent
                        ? 'bg-[#245A91] text-white ring-2 ring-[#245A91]/20'
                        : 'bg-white border border-[#DDE1E5] text-[#8993A4]'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-medium ${
                      isCurrent
                        ? 'text-[#245A91] font-semibold'
                        : isPast
                        ? 'text-[#172B4D]'
                        : 'text-[#8993A4]'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline SLA Details */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded text-[12px]">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">
              Assigned Regional Officer
            </span>
            <span className="text-[#172B4D] font-medium">
              {activeApp?.assignedOfficer || 'Regional Scrutiny Committee'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">
              SLA Completion Deadline
            </span>
            <span className={activeApp?.isOverdue ? 'text-[#DC2626] font-semibold' : 'text-[#172B4D]'}>
              {new Date(activeApp?.slaDeadline).toLocaleDateString()}
              {activeApp?.isOverdue && ' (Overdue)'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">
              Cumulative Ageing
            </span>
            <span className="text-[#172B4D] font-medium font-mono">
              {activeApp?.ageingDays} Days Elapsed
            </span>
          </div>
        </div>
      </div>

      {/* Affidavit-2 Time-Bound Undertakings */}
      <div className="enterprise-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F4]">
          <div>
            <h2 className="text-[13px] font-semibold text-[#172B4D]">
              Time-Bound Undertakings (Affidavit-2 Compliance)
            </h2>
            <p className="text-[12px] text-[#5E6C84]">
              Mandatory statutory commitments agreed during approval. Must be fulfilled before deadline.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {(activeApp?.undertakings || []).map((un: any) => {
            const isFulfilled = un.fulfilmentStatus === 'FULFILLED';
            const isOverdue = un.fulfilmentStatus === 'OVERDUE';
            const dueDate = new Date(un.dueDate);

            return (
              <div
                key={un.id}
                className="p-3 bg-white border border-[#DDE1E5] rounded flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#172B4D]">{un.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#EFF5FB] text-[#245A91] text-[10px] font-mono border border-[#D3DFED]">
                      {un.aphClause || 'APH Norm'}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#5E6C84]">{un.condition}</p>

                  <div className="flex items-center gap-3 text-[11px] text-[#8993A4] font-mono pt-0.5">
                    <span>Due: {dueDate.toLocaleDateString()}</span>
                    {un.remarks && <span>• Note: {un.remarks}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase ${
                      isFulfilled
                        ? 'bg-[#EFF8F3] text-[#1E7E45] border border-[#BDE3CF]'
                        : isOverdue
                        ? 'bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2]'
                        : 'bg-[#FEF6E7] text-[#9A6208] border border-[#FDE6B8]'
                    }`}
                  >
                    {un.fulfilmentStatus}
                  </span>

                  {!isFulfilled && (
                    <button
                      onClick={() => setSelectedUndertaking(un)}
                      className="px-2.5 py-1 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Proof</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Modal */}
      {selectedUndertaking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4">
          <div className="enterprise-panel max-w-md w-full p-5 space-y-3 bg-white shadow-lg">
            <h3 className="text-[14px] font-semibold text-[#172B4D] flex items-center gap-2 pb-2 border-b border-[#F0F2F4]">
              <UploadCloud className="w-4 h-4 text-[#245A91]" />
              Upload Affidavit-2 Compliance Proof
            </h3>

            <div className="p-2.5 bg-[#FAFBFC] border border-[#DDE1E5] rounded text-[12px]">
              <span className="text-[10px] text-[#8993A4] uppercase font-semibold block">Condition:</span>
              <p className="text-[#172B4D] mt-0.5">{selectedUndertaking.condition}</p>
            </div>

            <div className="space-y-2 text-[12px]">
              <div>
                <label className="text-[#5E6C84] font-medium block mb-1">
                  Compliance Document URL:
                </label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] font-mono"
                />
              </div>

              <div>
                <label className="text-[#5E6C84] font-medium block mb-1">
                  Principal Declaration Remarks:
                </label>
                <textarea
                  rows={2}
                  value={proofRemarks}
                  onChange={(e) => setProofRemarks(e.target.value)}
                  className="w-full p-2 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F2F4]">
              <button
                type="button"
                onClick={() => setSelectedUndertaking(null)}
                className="px-3 py-1.5 rounded bg-[#F4F5F7] text-[#5E6C84] text-[12px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFulfillUndertaking}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
