'use client';

import React from 'react';
import { BarChart3, Download, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { REGION_DETAILS } from '@/lib/types';

interface ReportsViewProps {
  applications: any[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ applications }) => {
  const regions = ['NWRO', 'NRO', 'WRO', 'CRO', 'ERO', 'SCRO', 'SRO', 'SWRO'];

  const regionalStats = regions.map((reg) => {
    const regApps = applications.filter((a) => a.institution?.region === reg);
    const total = regApps.length;
    const overdue = regApps.filter((a) => a.isOverdue).length;
    const onTime = total - overdue;
    const complianceRate = total > 0 ? Math.round((onTime / total) * 100) : 100;

    return {
      region: reg,
      name: REGION_DETAILS[reg]?.name || reg,
      hq: REGION_DETAILS[reg]?.hq || reg,
      total,
      onTime,
      overdue,
      complianceRate,
    };
  });

  return (
    <div className="space-y-4 max-w-[1216px] mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
            Analytical Reports & Regional Compliance Performance
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            Statistical governance metrics, SLA compliance percentages and regional operational efficiency
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-white hover:bg-[#F4F5F7] border border-[#DDE1E5] rounded text-[#172B4D] text-[12px] font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-[#5E6C84]" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3.5">
        <div className="enterprise-panel p-4">
          <span className="text-[11px] font-medium text-[#5E6C84] uppercase">Total Evaluated</span>
          <div className="text-[24px] font-semibold text-[#172B4D] mt-1">
            {applications.length}
          </div>
          <span className="text-[11px] text-[#8993A4]">Academic Year 2026-27</span>
        </div>

        <div className="enterprise-panel p-4">
          <span className="text-[11px] font-medium text-[#5E6C84] uppercase">Average Compliance</span>
          <div className="text-[24px] font-semibold text-[#1E7E45] mt-1">
            84.6%
          </div>
          <span className="text-[11px] text-[#8993A4]">Across 8 regional offices</span>
        </div>

        <div className="enterprise-panel p-4">
          <span className="text-[11px] font-medium text-[#5E6C84] uppercase">Overdue Cases</span>
          <div className="text-[24px] font-semibold text-[#DC2626] mt-1">
            {applications.filter((a) => a.isOverdue).length}
          </div>
          <span className="text-[11px] text-[#8993A4]">Requiring HQ review</span>
        </div>

        <div className="enterprise-panel p-4">
          <span className="text-[11px] font-medium text-[#5E6C84] uppercase">Average Turnaround</span>
          <div className="text-[24px] font-semibold text-[#245A91] mt-1">
            6.2 Days
          </div>
          <span className="text-[11px] text-[#8993A4]">Statutory target: 7 days</span>
        </div>
      </div>

      {/* Regional Efficiency Table */}
      <div className="enterprise-panel overflow-hidden">
        <div className="p-3.5 border-b border-[#DDE1E5] bg-white flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[#172B4D]">
            Regional Jurisdictions Performance Matrix
          </h2>
          <span className="text-[11px] text-[#8993A4]">Comprehensive regional audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="py-2.5 px-3.5 font-semibold">Regional Office</th>
                <th className="py-2.5 px-3.5 font-semibold">Headquarters</th>
                <th className="py-2.5 px-3.5 font-semibold">Applications</th>
                <th className="py-2.5 px-3.5 font-semibold">Within SLA</th>
                <th className="py-2.5 px-3.5 font-semibold">SLA Overdue</th>
                <th className="py-2.5 px-3.5 font-semibold">Compliance Rate</th>
                <th className="py-2.5 px-3.5 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F4] text-[12px]">
              {regionalStats.map((stat) => (
                <tr key={stat.region} className="table-row">
                  <td className="py-2.5 px-3.5 font-medium text-[#172B4D]">
                    {stat.region} ({stat.name})
                  </td>
                  <td className="py-2.5 px-3.5 text-[#5E6C84]">{stat.hq}</td>
                  <td className="py-2.5 px-3.5 font-mono text-[#172B4D]">{stat.total}</td>
                  <td className="py-2.5 px-3.5 font-mono text-[#1E7E45]">{stat.onTime}</td>
                  <td className="py-2.5 px-3.5 font-mono text-[#DC2626]">
                    {stat.overdue > 0 ? (
                      <span className="flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                        {stat.overdue}
                      </span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#F0F2F4] h-2 rounded-sm overflow-hidden">
                        <div
                          className="bg-[#245A91] h-full rounded-sm"
                          style={{ width: `${stat.complianceRate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#172B4D]">
                        {stat.complianceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                        stat.complianceRate >= 80
                          ? 'bg-[#EFF8F3] text-[#1E7E45] border border-[#BDE3CF]'
                          : 'bg-[#FEF6E7] text-[#9A6208] border border-[#FDE6B8]'
                      }`}
                    >
                      {stat.complianceRate >= 80 ? 'Optimal' : 'Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
