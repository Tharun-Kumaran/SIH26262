'use client';

import React from 'react';
import {
  FastForward,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

interface FastForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
}

export const FastForwardModal: React.FC<FastForwardModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4">
      <div className="enterprise-panel w-full max-w-lg rounded bg-white p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F4]">
          <div className="flex items-center gap-2 text-[#245A91]">
            <FastForward className="w-4 h-4" />
            <h3 className="text-[14px] font-semibold text-[#172B4D]">
              Automated Cron Simulation Execution (+7 Days)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#F4F5F7] text-[#5E6C84]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded bg-[#FAFBFC] border border-[#DDE1E5]">
            <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">Scanned</span>
            <span className="text-[18px] font-semibold text-[#172B4D] block mt-0.5">
              {report.scannedApplications || 0}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#FAFBFC] border border-[#DDE1E5]">
            <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">SLA Breaches</span>
            <span className="text-[18px] font-semibold text-[#DC2626] block mt-0.5">
              {report.slaBreachesDetected || 0}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#FAFBFC] border border-[#DDE1E5]">
            <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">HQ Escalated</span>
            <span className="text-[18px] font-semibold text-[#D97706] block mt-0.5">
              {report.escalatedToHQ || 0}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#FAFBFC] border border-[#DDE1E5]">
            <span className="text-[10px] uppercase font-semibold text-[#8993A4] block">Doc Expiries</span>
            <span className="text-[18px] font-semibold text-[#5E6C84] block mt-0.5">
              {report.expiringDocumentsDetected || 0}
            </span>
          </div>
        </div>

        {/* Detailed Stream */}
        <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded space-y-1.5 text-[11px] font-mono">
          <span className="text-[#8993A4] uppercase font-semibold text-[10px] block font-sans">
            AICTE Cron Engine Activity:
          </span>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {report.details && report.details.length > 0 ? (
              report.details.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-1.5 text-[#172B4D]">
                  <span className="text-[#245A91] font-bold shrink-0">›</span>
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <div className="text-[#8993A4] italic">
                All applications within statutory SLA boundaries.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#F0F2F4]">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white font-medium text-[12px] shadow-sm"
          >
            Close & Review Updated Dashboards
          </button>
        </div>
      </div>
    </div>
  );
};
