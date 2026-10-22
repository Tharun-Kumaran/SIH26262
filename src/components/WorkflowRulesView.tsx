'use client';

import React, { useState } from 'react';
import { Sliders, CheckCircle2, Shield } from 'lucide-react';
import { STAGE_LABELS } from '@/lib/types';

interface WorkflowRulesViewProps {
  rules: any[];
  onRefresh: () => void;
}

export const WorkflowRulesView: React.FC<WorkflowRulesViewProps> = ({ rules, onRefresh }) => {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editSlaDays, setEditSlaDays] = useState<number>(7);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = async (ruleId: string) => {
    try {
      setIsUpdating(true);
      const res = await fetch('/api/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId, slaDays: editSlaDays }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`SLA updated to ${editSlaDays} days!`);
        setEditingRuleId(null);
        setTimeout(() => setSuccessMsg(null), 3000);
        onRefresh();
      }
    } catch {
      alert('Failed to update workflow rule');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1216px] mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
            Workflow Rules & SLA Turnaround Configuration
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            Central governance matrix defining statutory SLA days, approval authorities and state transitions
          </p>
        </div>

        {successMsg && (
          <div className="px-3 py-1.5 rounded bg-[#EFF8F3] border border-[#BDE3CF] text-[#1E7E45] text-[12px] font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Rules Table */}
      <div className="enterprise-panel overflow-hidden">
        <div className="p-3.5 border-b border-[#DDE1E5] bg-white flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[#172B4D]">
            Configured Approval Tracks & Stage Matrix
          </h2>
          <span className="text-[11px] text-[#8993A4]">
            Regulation Bureau Policy Matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="py-2.5 px-3.5 font-semibold">APH Track</th>
                <th className="py-2.5 px-3.5 font-semibold">Stage Name</th>
                <th className="py-2.5 px-3.5 font-semibold">Allocated SLA</th>
                <th className="py-2.5 px-3.5 font-semibold">Approving Authority</th>
                <th className="py-2.5 px-3.5 font-semibold">Permitted Next Transitions</th>
                <th className="py-2.5 px-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F4] text-[12px]">
              {rules.map((rule) => {
                const isEditing = editingRuleId === rule.id;
                let transitions: string[] = [];
                try {
                  transitions = JSON.parse(rule.allowedTransitions || '[]');
                } catch {
                  transitions = [rule.allowedTransitions];
                }

                return (
                  <tr key={rule.id} className="table-row">
                    <td className="py-2.5 px-3.5 font-mono text-[#245A91] font-medium">
                      {rule.aphTrack}
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-[#172B4D]">
                      {STAGE_LABELS[rule.stage] || rule.stage}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={editSlaDays}
                            onChange={(e) => setEditSlaDays(Number(e.target.value))}
                            className="w-14 px-1.5 py-0.5 text-[12px] bg-white border border-[#245A91] rounded text-[#172B4D] font-mono focus:outline-none"
                          />
                          <span className="text-[#5E6C84] text-[11px]">days</span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#F4F5F7] border border-[#DDE1E5] text-[#172B4D] font-mono font-medium">
                          {rule.slaDays} Days
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#5E6C84]">
                      {rule.requiresApprovalBy}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="flex flex-wrap gap-1">
                        {transitions.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded bg-[#FAFBFC] border border-[#DDE1E5] text-[#5E6C84] text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSave(rule.id)}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[11px] font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRuleId(null)}
                            className="px-2 py-1 rounded bg-[#F4F5F7] text-[#5E6C84] text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRuleId(rule.id);
                            setEditSlaDays(rule.slaDays);
                          }}
                          className="px-2 py-1 rounded bg-white hover:bg-[#F4F5F7] border border-[#DDE1E5] text-[#245A91] text-[11px] font-medium"
                        >
                          Modify SLA
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
