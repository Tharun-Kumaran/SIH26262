'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface PriorityApplication {
  id: string;
  appId: string;
  institution: string;
  region: string;
  stage: string;
  slaDeadline: string;
  ageing: string;
  status: 'In Review' | 'Overdue' | 'Scheduled' | 'Escalated to HQ' | 'On Track';
  rawApp?: any;
}

interface NationalOverviewProps {
  onSelectApplication: (app: any) => void;
  onNavigateTab: (tab: any) => void;
  applications: any[];
  auditLogs: any[];
}

export const NationalOverview: React.FC<NationalOverviewProps> = ({
  onSelectApplication,
  onNavigateTab,
  applications,
  auditLogs,
}) => {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Four Summary Metrics (matching exact specifications)
  const metrics = [
    { label: 'Active applications', value: '128', subtext: 'AY 2026-27' },
    { label: 'Pending scrutiny', value: '34', subtext: 'Regional committees' },
    { label: 'Approaching SLA', value: '12', subtext: 'Within 48 hours', indicator: 'amber' },
    { label: 'Overdue cases', value: '7', subtext: 'Requires intervention', indicator: 'red' },
  ];

  // 2. Analytical Charts Data
  const regionData = [
    { region: 'NWRO', count: 14, max: 30 },
    { region: 'NRO', count: 22, max: 30 },
    { region: 'WRO', count: 28, max: 30 },
    { region: 'CRO', count: 11, max: 30 },
    { region: 'ERO', count: 9, max: 30 },
    { region: 'SCRO', count: 18, max: 30 },
    { region: 'SRO', count: 19, max: 30 },
    { region: 'SWRO', count: 7, max: 30 },
  ];

  const stageData = [
    { stage: 'Scrutiny', count: 34, total: 128 },
    { stage: 'Re-scrutiny', count: 16, total: 128 },
    { stage: 'EVC', count: 28, total: 128 },
    { stage: 'Committee Review', count: 19, total: 128 },
    { stage: 'Decision', count: 31, total: 128 },
  ];

  // 3. Operational Table: Priority Applications (6 demo records strictly matching prompt)
  const defaultTableData: PriorityApplication[] = [
    {
      id: 'app-1',
      appId: 'APP-2026-8492',
      institution: 'Madras Inst of Engineering & Tech',
      region: 'SRO',
      stage: 'Scrutiny',
      slaDeadline: '24 Oct 2026',
      ageing: '4d',
      status: 'In Review',
    },
    {
      id: 'app-2',
      appId: 'APP-2026-3920',
      institution: 'Bombay Advanced Polytechnic',
      region: 'WRO',
      stage: 'Re-scrutiny',
      slaDeadline: '19 Oct 2026',
      ageing: '12d',
      status: 'Overdue',
    },
    {
      id: 'app-3',
      appId: 'APP-2026-5928',
      institution: 'Kanpur Institute of Technology',
      region: 'NRO',
      stage: 'EVC Scheduled',
      slaDeadline: '26 Oct 2026',
      ageing: '9d',
      status: 'Scheduled',
    },
    {
      id: 'app-4',
      appId: 'APP-2026-7819',
      institution: 'Chandigarh Inst of AI & Robotics',
      region: 'NWRO',
      stage: 'Committee Review',
      slaDeadline: '21 Oct 2026',
      ageing: '18d',
      status: 'Overdue',
    },
    {
      id: 'app-5',
      appId: 'APP-2026-1204',
      institution: 'Bhopal Central Inst of Pharmacy',
      region: 'CRO',
      stage: 'Scrutiny',
      slaDeadline: '17 Oct 2026',
      ageing: '11d',
      status: 'Escalated to HQ',
    },
    {
      id: 'app-6',
      appId: 'APP-2026-9028',
      institution: 'Hyderabad Cyber Valley Tech',
      region: 'SCRO',
      stage: 'Decision',
      slaDeadline: '23 Oct 2026',
      ageing: '2d',
      status: 'On Track',
    },
  ];

  const filteredTableData = defaultTableData.filter((item) => {
    const matchesRegion =
      selectedRegionFilter === 'ALL' || item.region === selectedRegionFilter;
    const matchesSearch =
      !searchQuery ||
      item.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // 4. Recent Activity Log Entries
  const recentActivities = [
    {
      time: '1:36:34 PM',
      role: 'RO Officer',
      action: 'Assigned committee for preliminary scrutiny',
      appRef: 'APP-2026-8492',
      institution: 'Madras Inst of Engineering & Tech',
    },
    {
      time: '1:18:22 PM',
      role: 'Scrutiny Committee',
      action: 'Deficiency tagged: Land Lease Deed expiry within 15 days',
      appRef: 'APP-2026-3920',
      institution: 'Bombay Advanced Polytechnic',
    },
    {
      time: '12:45:09 PM',
      role: 'System Cron',
      action: 'SLA breach detected (3 days overdue). Auto-escalated to Level-2 HQ',
      appRef: 'APP-2026-1204',
      institution: 'Bhopal Central Inst of Pharmacy',
    },
    {
      time: '11:20:41 AM',
      role: 'EVC Expert',
      action: 'Inspection date locked with GPS geotag verification (26.4499° N, 80.3319° E)',
      appRef: 'APP-2026-5928',
      institution: 'Kanpur Institute of Technology',
    },
  ];

  return (
    <div className="space-y-5 max-w-[1216px] mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
          National Overview
        </h1>
        <p className="text-[13px] text-[#5E6C84] mt-0.5">
          Approval processing and institutional compliance
        </p>
      </div>

      {/* Summary Metrics Row (4 Compact Cards) */}
      <div className="grid grid-cols-4 gap-3.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="enterprise-panel p-4 flex flex-col justify-between h-[86px]"
          >
            <div className="flex items-center justify-between text-[12px] text-[#5E6C84]">
              <span>{m.label}</span>
              {m.indicator === 'amber' && (
                <span className="w-2 h-2 rounded-full bg-[#D97706]" title="Approaching SLA" />
              )}
              {m.indicator === 'red' && (
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" title="Overdue Case" />
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[26px] font-semibold text-[#172B4D] leading-none">
                {m.value}
              </span>
              <span className="text-[11px] text-[#8993A4]">{m.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Section (Two Columns) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Application pendency by region */}
        <div className="enterprise-panel p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0F2F4]">
            <h2 className="text-[13px] font-semibold text-[#172B4D]">
              Application pendency by region
            </h2>
            <span className="text-[11px] text-[#8993A4]">Total: 128</span>
          </div>

          <div className="space-y-2 pt-1">
            {regionData.map((item) => {
              const percentage = Math.round((item.count / 30) * 100);
              return (
                <div key={item.region} className="flex items-center text-[12px]">
                  <span className="w-12 font-medium text-[#172B4D] text-[11px] shrink-0">
                    {item.region}
                  </span>
                  <div className="flex-1 bg-[#F0F2F4] h-4 rounded-sm mx-2 overflow-hidden flex items-center">
                    <div
                      className="bg-[#245A91] h-full rounded-sm transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-medium text-[#172B4D] text-[11px]">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Applications by stage */}
        <div className="enterprise-panel p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0F2F4]">
            <h2 className="text-[13px] font-semibold text-[#172B4D]">
              Applications by stage
            </h2>
            <span className="text-[11px] text-[#8993A4]">Current status</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {stageData.map((item) => {
              const pct = Math.round((item.count / item.total) * 100);
              return (
                <div key={item.stage} className="text-[12px]">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-[#172B4D] font-medium">{item.stage}</span>
                    <span className="text-[#5E6C84] font-medium">
                      {item.count}{' '}
                      <span className="text-[11px] text-[#8993A4]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F0F2F4] h-3 rounded-sm overflow-hidden">
                    <div
                      className="bg-[#5B82A6] h-full rounded-sm"
                      style={{ width: `${pct * 2.2}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operational Table: Priority Applications */}
      <div className="enterprise-panel overflow-hidden">
        {/* Table Title & Filter Bar */}
        <div className="p-3.5 border-b border-[#DDE1E5] flex items-center justify-between bg-white">
          <h2 className="text-[13px] font-semibold text-[#172B4D]">
            Priority applications
          </h2>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8993A4]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded w-44 focus:outline-none focus:border-[#245A91]"
              />
            </div>

            {/* Region Filter */}
            <div className="relative">
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                className="px-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91] appearance-none pr-7 cursor-pointer"
              >
                <option value="ALL">Region: All</option>
                <option value="NWRO">NWRO</option>
                <option value="NRO">NRO</option>
                <option value="WRO">WRO</option>
                <option value="CRO">CRO</option>
                <option value="ERO">ERO</option>
                <option value="SCRO">SCRO</option>
                <option value="SRO">SRO</option>
                <option value="SWRO">SWRO</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#5E6C84] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="py-2.5 px-3.5 font-semibold">Application ID</th>
                <th className="py-2.5 px-3.5 font-semibold">Institution</th>
                <th className="py-2.5 px-3.5 font-semibold">Region</th>
                <th className="py-2.5 px-3.5 font-semibold">Current stage</th>
                <th className="py-2.5 px-3.5 font-semibold">SLA deadline</th>
                <th className="py-2.5 px-3.5 font-semibold">Ageing</th>
                <th className="py-2.5 px-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F4] text-[12px]">
              {filteredTableData.map((row) => {
                const isOverdue = row.status === 'Overdue';
                return (
                  <tr
                    key={row.id}
                    onClick={() => {
                      const matched = applications.find(
                        (a) => a.applicationNo === row.appId || a.id === row.id
                      );
                      onSelectApplication(matched || row);
                    }}
                    className="table-row cursor-pointer"
                  >
                    <td className="py-2.5 px-3.5 font-medium text-[#245A91] hover:underline">
                      {row.appId}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#172B4D] font-normal">
                      {row.institution}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#5E6C84] font-medium">
                      {row.region}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#172B4D]">
                      {row.stage}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#5E6C84]">
                      {row.slaDeadline}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#5E6C84]">
                      {row.ageing}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {isOverdue ? (
                        <div className="flex items-center gap-1.5 text-[#DC2626] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                          <span>Overdue</span>
                        </div>
                      ) : row.status === 'Escalated to HQ' ? (
                        <div className="flex items-center gap-1.5 text-[#B45309] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                          <span>Escalated to HQ</span>
                        </div>
                      ) : (
                        <span className="text-[#5E6C84]">{row.status}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Recent Activity Audit Log */}
      <div className="enterprise-panel p-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F4] mb-2.5">
          <h2 className="text-[13px] font-semibold text-[#172B4D]">
            Recent activity
          </h2>
          <button
            onClick={() => onNavigateTab('audit')}
            className="text-[11px] text-[#245A91] hover:underline font-medium"
          >
            View full audit trail
          </button>
        </div>

        <div className="space-y-2 text-[12px]">
          {recentActivities.map((act, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-1 border-b border-[#F8F9FA] last:border-b-0 gap-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-[#8993A4] font-mono shrink-0 w-20">
                  {act.time}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#F4F5F7] border border-[#DDE1E5] text-[#5E6C84] text-[10px] font-medium shrink-0">
                  {act.role}
                </span>
                <span className="text-[#172B4D]">
                  {act.action}
                </span>
              </div>
              <span className="text-[11px] text-[#245A91] hover:underline font-mono shrink-0">
                {act.appRef}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
