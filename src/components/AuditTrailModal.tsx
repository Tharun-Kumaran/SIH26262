'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Search,
  ArrowRight,
  Clock,
  User,
  Fingerprint,
} from 'lucide-react';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: any[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  auditLogs,
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSearch =
      !searchTerm ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.application?.applicationNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4">
      <div className="enterprise-panel w-full max-w-4xl max-h-[85vh] rounded bg-white flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#DDE1E5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#EFF5FB] border border-[#D3DFED] flex items-center justify-center text-[#245A91]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#172B4D] flex items-center gap-2">
                AICTE Statutory Audit Trail Ledger
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#EFF8F3] text-[#1E7E45] border border-[#BDE3CF]">
                  APPEND-ONLY
                </span>
              </h2>
              <p className="text-[11px] text-[#5E6C84]">
                Immutable, tamper-evident chronological record of all approval workflow transitions and escalations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#F4F5F7] text-[#5E6C84] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 border-b border-[#F0F2F4] bg-[#FAFBFC] flex items-center justify-between gap-3 text-[12px]">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8993A4]" />
            <input
              type="text"
              placeholder="Search audit ledger by keyword, actor, or ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['ALL', 'STAGE_TRANSITION', 'SLA_BREACH_DETECTED', 'ESCALATED_TO_HQ', 'DEFICIENCY_MARKED'].map(
              (act) => (
                <button
                  key={act}
                  onClick={() => setFilterAction(act)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    filterAction === act
                      ? 'bg-[#245A91] text-white font-medium'
                      : 'bg-white text-[#5E6C84] hover:bg-[#F4F5F7] border border-[#DDE1E5]'
                  }`}
                >
                  {act.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredLogs.map((log) => {
            const time = new Date(log.timestamp);
            const isBreachOrEscalated =
              log.action.includes('ESCALATED') || log.action.includes('BREACH');

            return (
              <div
                key={log.id}
                className="p-3 rounded bg-white border border-[#DDE1E5] space-y-1.5 text-[12px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase ${
                        isBreachOrEscalated
                          ? 'bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2]'
                          : 'bg-[#EFF5FB] text-[#245A91] border border-[#D3DFED]'
                      }`}
                    >
                      {log.action}
                    </span>

                    {log.stageFrom && log.stageTo && (
                      <div className="flex items-center gap-1 text-[11px] text-[#5E6C84] font-mono">
                        <span>{log.stageFrom}</span>
                        <ArrowRight className="w-3 h-3 text-[#8993A4]" />
                        <span className="font-semibold text-[#172B4D]">{log.stageTo}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] text-[#8993A4] font-mono">
                    {time.toLocaleString()}
                  </span>
                </div>

                <p className="text-[#172B4D] leading-relaxed">{log.details}</p>

                <div className="pt-1.5 border-t border-[#F8F9FA] flex items-center justify-between text-[11px] text-[#5E6C84]">
                  <div className="flex items-center gap-2">
                    <span>Actor: {log.actorName}</span>
                    <span className="px-1 py-0.2 rounded bg-[#F4F5F7] text-[#5E6C84] text-[10px] font-mono">
                      {log.actorRole}
                    </span>
                  </div>

                  <span className="text-[#8993A4] font-mono text-[10px]">
                    SHA256({log.id.substring(0, 10)}...)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
