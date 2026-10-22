'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Send,
  Building,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Check,
  FileWarning,
  Search,
  Filter,
} from 'lucide-react';
import { DOCUMENT_CATEGORIES, STAGE_LABELS, Role } from '@/lib/types';

interface ScrutinyPortalProps {
  applications: any[];
  selectedAppId?: string;
  onRefresh: () => void;
  onSelectApplication: (app: any) => void;
  currentRole?: Role;
}

export const ScrutinyPortal: React.FC<ScrutinyPortalProps> = ({
  applications,
  selectedAppId,
  onRefresh,
  currentRole = 'SCRUTINY_COMMITTEE',
}) => {
  const scrutinyQueue = applications.filter((a) =>
    ['SCRUTINY', 'RE_SCRUTINY', 'SUBMITTED', 'EVC_COMPLETED'].includes(a.currentStage)
  );

  const [activeAppId, setActiveAppId] = useState<string>(
    selectedAppId || (scrutinyQueue[0] ? scrutinyQueue[0].id : '')
  );

  const activeApp =
    applications.find((a) => a.id === activeAppId) || scrutinyQueue[0] || applications[0];

  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [deficiencyReason, setDeficiencyReason] = useState<string>('');
  const [showRevertModal, setShowRevertModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [docRemarks, setDocRemarks] = useState<Record<string, string>>({});
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const activeDocuments = activeApp?.documents || [];
  const currentDoc =
    activeDocuments.find((d: any) => d.id === selectedDocId) || activeDocuments[0];

  const handleVerifyDoc = async (docId: string, status: 'VERIFIED' | 'DEFICIENT') => {
    try {
      setIsSubmitting(true);
      const remarks =
        docRemarks[docId] ||
        (status === 'DEFICIENT'
          ? 'Deficiencies noted in statutory norm compliance'
          : 'All norms verified and approved.');
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-document',
          documentId: docId,
          verificationStatus: status,
          deficiencyRemarks: remarks,
          actorName: 'Scrutiny Committee Chair',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(`Document marked as ${status}`);
        setTimeout(() => setActionSuccessMessage(null), 3000);
        onRefresh();
      }
    } catch {
      alert('Failed to update document status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevertForReScrutiny = async () => {
    if (!deficiencyReason || deficiencyReason.trim().length < 5) {
      alert('Please specify a valid deficiency reason (minimum 5 characters)');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/workflow/transition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: activeApp.id,
          targetStage: 'RE_SCRUTINY',
          actorRole: currentRole === 'RO_OFFICER' ? 'RO_OFFICER' : (currentRole === 'REGULATION_BUREAU_ADMIN' ? 'REGULATION_BUREAU_ADMIN' : 'SCRUTINY_COMMITTEE'),
          actorName: currentRole === 'RO_OFFICER' ? 'Regional Officer (RO)' : 'Scrutiny Committee Chair',
          deficiencyReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowRevertModal(false);
        setDeficiencyReason('');
        setActionSuccessMessage(
          `Application ${activeApp.applicationNo} successfully reverted to Re-Scrutiny.`
        );
        setTimeout(() => setActionSuccessMessage(null), 4000);
        onRefresh();
      } else {
        alert(data.error || 'Failed to revert application');
      }
    } catch (e: any) {
      alert(e.message || 'Error executing transition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveAndQueueEVC = async () => {
    try {
      setIsSubmitting(true);
      const targetStage =
        activeApp.aphTrack === 'EOA_STANDARD' && activeApp.deficiencyCount === 0
          ? 'EOA_GRANTED'
          : 'EVC_SCHEDULED';

      const res = await fetch('/api/workflow/transition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: activeApp.id,
          targetStage,
          actorRole: currentRole === 'RO_OFFICER' ? 'RO_OFFICER' : (currentRole === 'REGULATION_BUREAU_ADMIN' ? 'REGULATION_BUREAU_ADMIN' : 'SCRUTINY_COMMITTEE'),
          actorName: currentRole === 'RO_OFFICER' ? 'Regional Officer (RO)' : 'Scrutiny Committee Chair',
          approvalDecision: targetStage === 'EOA_GRANTED' ? 'APPROVED' : 'PENDING',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(
          `Application advanced to ${STAGE_LABELS[targetStage] || targetStage}!`
        );
        setTimeout(() => setActionSuccessMessage(null), 4000);
        onRefresh();
      } else {
        alert(data.error || 'Failed to advance application');
      }
    } catch (e: any) {
      alert(e.message || 'Error executing transition');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1216px] mx-auto">
      {/* Page Title & Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
            Document Scrutiny Workstation
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            Regional verification of statutory documents, deficiency tagging and APH approvals
          </p>
        </div>

        {actionSuccessMessage && (
          <div className="px-3 py-1.5 rounded bg-[#EFF8F3] border border-[#BDE3CF] text-[#1E7E45] text-[12px] font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Scrutiny Queue Strip */}
      <div className="enterprise-panel p-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6C84] mb-2 flex items-center justify-between">
          <span>Scrutiny Queue ({scrutinyQueue.length} Applications)</span>
          <span className="text-[11px] text-[#8993A4] font-normal">Select an application to evaluate</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {scrutinyQueue.map((app) => {
            const isSelected = app.id === activeApp?.id;
            return (
              <button
                key={app.id}
                onClick={() => {
                  setActiveAppId(app.id);
                  if (app.documents?.[0]) setSelectedDocId(app.documents[0].id);
                }}
                className={`p-2.5 rounded border text-left shrink-0 transition-colors w-52 ${
                  isSelected
                    ? 'bg-[#EFF5FB] border-[#245A91] text-[#172B4D]'
                    : 'bg-white border-[#DDE1E5] text-[#172B4D] hover:bg-[#FAFBFC]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-semibold text-[#245A91]">{app.applicationNo}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                      app.isOverdue
                        ? 'bg-[#FEECEB] text-[#DC2626]'
                        : 'bg-[#F4F5F7] text-[#5E6C84]'
                    }`}
                  >
                    {app.currentStage}
                  </span>
                </div>
                <div className="text-[12px] font-medium truncate mt-1 text-[#172B4D]">
                  {app.institution?.name}
                </div>
                <div className="text-[11px] text-[#5E6C84] flex items-center justify-between mt-1">
                  <span>{app.institution?.region}</span>
                  <span className={app.isOverdue ? 'text-[#DC2626] font-medium' : ''}>
                    {app.isOverdue ? 'Overdue' : `Age: ${app.ageingDays}d`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split-Screen Document Verifier */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column: Metadata & Checklist */}
        <div className="col-span-5 space-y-4">
          {/* Active Application Info Card */}
          <div className="enterprise-panel p-3.5 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-medium text-[#245A91] bg-[#EFF5FB] px-1.5 py-0.5 rounded border border-[#D3DFED]">
                  PID: {activeApp?.institution?.aictePid}
                </span>
                <h2 className="text-[14px] font-semibold text-[#172B4D] mt-1.5">
                  {activeApp?.institution?.name}
                </h2>
                <p className="text-[12px] text-[#5E6C84]">
                  {activeApp?.institution?.city}, {activeApp?.institution?.state} ({activeApp?.institution?.region} Region)
                </p>
              </div>

              <div className="text-right text-[11px]">
                <span className="font-medium text-[#1E7E45] bg-[#EFF8F3] px-2 py-0.5 rounded border border-[#BDE3CF]">
                  TER: ₹{activeApp?.terFeeAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F2F4] flex items-center justify-between text-[11px] text-[#5E6C84]">
              <span>SLA Target: {new Date(activeApp?.slaDeadline).toLocaleDateString()}</span>
              <span className={activeApp?.isOverdue ? 'text-[#DC2626] font-semibold' : 'text-[#1E7E45]'}>
                {activeApp?.isOverdue ? 'SLA BREACHED' : 'Within SLA'}
              </span>
            </div>

            {activeApp?.scrutinyRemark && (
              <div className="p-2 bg-[#FEF6E7] border border-[#FDE6B8] rounded text-[11px] text-[#9A6208]">
                <span className="font-semibold">Last Remark: </span>
                {activeApp.scrutinyRemark}
              </div>
            )}
          </div>

          {/* APH Checklist */}
          <div className="enterprise-panel p-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F4] mb-2.5">
              <h3 className="text-[12px] font-semibold text-[#172B4D] uppercase tracking-wide">
                APH Document Checklist ({activeDocuments.length})
              </h3>
              <span className="text-[11px] text-[#8993A4]">APH 2024-27 Norms</span>
            </div>

            <div className="space-y-1.5">
              {activeDocuments.map((doc: any) => {
                const isSelected = doc.id === currentDoc?.id;
                const isExpired = doc.verificationStatus === 'EXPIRED';
                const isDeficient = doc.verificationStatus === 'DEFICIENT';
                const isVerified = doc.verificationStatus === 'VERIFIED';

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-2.5 rounded border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EFF5FB] border-[#245A91]'
                        : 'bg-white border-[#DDE1E5] hover:bg-[#FAFBFC]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <FileText
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isVerified
                              ? 'text-[#1E7E45]'
                              : isDeficient || isExpired
                              ? 'text-[#DC2626]'
                              : 'text-[#D97706]'
                          }`}
                        />
                        <div>
                          <div className="text-[12px] font-medium text-[#172B4D]">
                            {DOCUMENT_CATEGORIES[doc.category] || doc.category}
                          </div>
                          <div className="text-[11px] text-[#5E6C84] font-mono">
                            {doc.documentNumber || 'Doc Ref Pending'}
                          </div>
                          {doc.expiryDate && (
                            <div
                              className={`text-[10px] mt-0.5 ${
                                doc.isExpiringSoon || isExpired
                                  ? 'text-[#DC2626] font-medium'
                                  : 'text-[#8993A4]'
                              }`}
                            >
                              Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                              {doc.isExpiringSoon && ' (Expiring Soon)'}
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase shrink-0 ${
                          isVerified
                            ? 'bg-[#EFF8F3] text-[#1E7E45] border border-[#BDE3CF]'
                            : isDeficient
                            ? 'bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2]'
                            : isExpired
                            ? 'bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2]'
                            : 'bg-[#FEF6E7] text-[#9A6208] border border-[#FDE6B8]'
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </div>

                    {doc.deficiencyRemarks && (
                      <div className="mt-1 text-[11px] text-[#DC2626] bg-[#FEECEB] p-1.5 rounded">
                        {doc.deficiencyRemarks}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Committee Actions */}
          <div className="enterprise-panel p-3.5 space-y-2">
            <h3 className="text-[12px] font-semibold text-[#172B4D] uppercase tracking-wide">
              Committee Determination
            </h3>

            <button
              onClick={() => setShowRevertModal(true)}
              disabled={isSubmitting}
              className="w-full py-2 px-3 rounded bg-white hover:bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revert for Re-Scrutiny with Deficiency Tag</span>
            </button>

            <button
              onClick={handleApproveAndQueueEVC}
              disabled={isSubmitting}
              className="w-full py-2 px-3 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {activeApp?.aphTrack === 'EOA_STANDARD' && activeApp?.deficiencyCount === 0
                  ? 'Approve & Grant Extension of Approval'
                  : 'Approve Scrutiny & Queue for EVC'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Clean Document Inspector */}
        <div className="col-span-7">
          <div className="enterprise-panel p-4 flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Document Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F4]">
                <div>
                  <span className="text-[11px] font-mono text-[#5E6C84]">
                    Category: {currentDoc?.category || 'LEASE_DEED'}
                  </span>
                  <h2 className="text-[14px] font-semibold text-[#172B4D] mt-0.5">
                    {currentDoc?.documentTitle || 'Select a document'}
                  </h2>
                </div>

                <a
                  href={currentDoc?.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#172B4D] border border-[#DDE1E5] text-[11px] font-medium flex items-center gap-1"
                >
                  <span>PDF Document</span>
                  <ExternalLink className="w-3 h-3 text-[#5E6C84]" />
                </a>
              </div>

              {/* Inspection Metadata Canvas */}
              <div className="mt-4 p-4 rounded bg-[#FAFBFC] border border-[#DDE1E5] space-y-3 text-[12px]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white border border-[#DDE1E5] rounded">
                    <span className="text-[10px] text-[#8993A4] uppercase font-semibold block">
                      Registered Number
                    </span>
                    <span className="font-medium text-[#172B4D] text-[12px]">
                      {currentDoc?.documentNumber || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white border border-[#DDE1E5] rounded">
                    <span className="text-[10px] text-[#8993A4] uppercase font-semibold block">
                      Expiry Date
                    </span>
                    <span
                      className={`font-medium text-[12px] ${
                        currentDoc?.isExpiringSoon || currentDoc?.verificationStatus === 'EXPIRED'
                          ? 'text-[#DC2626] font-semibold'
                          : 'text-[#172B4D]'
                      }`}
                    >
                      {currentDoc?.expiryDate
                        ? new Date(currentDoc.expiryDate).toLocaleDateString()
                        : 'Perpetual / Non-Expiring'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#DDE1E5] rounded space-y-1">
                  <span className="text-[10px] text-[#8993A4] uppercase font-semibold block">
                    Statutory APH Norm (Chapter 2)
                  </span>
                  <p className="text-[#5E6C84] text-[12px] leading-relaxed">
                    {currentDoc?.category === 'LEASE_DEED' &&
                      'Must be minimum 30 years registered lease in favor of applicant Trust/Society, executed by Sub-Registrar.'}
                    {currentDoc?.category === 'FIRE_SAFETY_NOC' &&
                      'Valid Fire Safety NOC issued by competent Municipal/State Fire Department, renewed annually.'}
                    {currentDoc?.category === 'STRUCTURAL_STABILITY' &&
                      'Structural Stability Certificate from Registered Chartered Structural Engineer endorsed by PWD.'}
                    {currentDoc?.category === 'BANK_FDR' &&
                      'Joint FDR executed with Regional Officer AICTE for mandatory security deposit corpus.'}
                    {currentDoc?.category === 'AFFIDAVIT_2' &&
                      'Notarized commitment for cadre ratio, equipment, and barrier-free access for Divyangjan.'}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#5E6C84] block mb-1">
                    Scrutiny Remarks / Specific Norm Observation:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter verification notes or specify defects..."
                    value={docRemarks[currentDoc?.id] ?? (currentDoc?.deficiencyRemarks || '')}
                    onChange={(e) =>
                      setDocRemarks({ ...docRemarks, [currentDoc?.id]: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
                  />
                </div>
              </div>
            </div>

            {/* Individual Document Action Bar */}
            <div className="mt-4 pt-3 border-t border-[#F0F2F4] flex items-center justify-between">
              <span className="text-[12px] text-[#5E6C84]">
                Current status:{' '}
                <span className="font-semibold text-[#172B4D]">
                  {currentDoc?.verificationStatus || 'PENDING'}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerifyDoc(currentDoc?.id, 'DEFICIENT')}
                  disabled={isSubmitting || !currentDoc}
                  className="px-3 py-1.5 rounded bg-white hover:bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2] text-[12px] font-medium flex items-center gap-1 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Mark Deficient</span>
                </button>

                <button
                  onClick={() => handleVerifyDoc(currentDoc?.id, 'VERIFIED')}
                  disabled={isSubmitting || !currentDoc}
                  className="px-3.5 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Institutional Revert Modal */}
      {showRevertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4">
          <div className="enterprise-panel max-w-lg w-full p-5 space-y-3.5 shadow-lg bg-white">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F4]">
              <h3 className="text-[14px] font-semibold text-[#172B4D] flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-[#DC2626]" />
                Revert to Re-Scrutiny with Deficiency Tag
              </h3>
            </div>

            <p className="text-[12px] text-[#5E6C84]">
              Reverting application <span className="font-mono font-medium text-[#172B4D]">{activeApp?.applicationNo}</span>{' '}
              resets the turnaround SLA to 4 days and notifies the institution of specific deficiencies to rectify.
            </p>

            <div>
              <span className="text-[11px] text-[#5E6C84] font-medium block mb-1">
                Standard APH Deficiency Templates:
              </span>
              <div className="space-y-1">
                {[
                  'Land Lease Deed expiring within 15 days; extension registration pending.',
                  'Fire Safety NOC expired; annual renewal clearance required.',
                  'Structural Stability Certificate lacks official PWD endorsement seal.',
                  'Cadre ratio deficit: insufficient regular Professors in primary discipline.',
                ].map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDeficiencyReason(tmpl)}
                    className="w-full text-left p-1.5 rounded bg-[#FAFBFC] hover:bg-[#F0F2F4] text-[11px] text-[#172B4D] border border-[#DDE1E5] truncate"
                  >
                    • {tmpl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[12px] font-medium text-[#172B4D] block mb-1">
                Mandatory Deficiency Remark:
              </label>
              <textarea
                rows={3}
                value={deficiencyReason}
                onChange={(e) => setDeficiencyReason(e.target.value)}
                placeholder="Specify precise non-compliance remark..."
                className="w-full p-2 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F2F4]">
              <button
                type="button"
                onClick={() => setShowRevertModal(false)}
                className="px-3 py-1.5 rounded bg-[#F4F5F7] text-[#5E6C84] hover:bg-[#EBECF0] text-[12px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevertForReScrutiny}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-medium shadow-sm"
              >
                {isSubmitting ? 'Recording...' : 'Confirm Revert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
