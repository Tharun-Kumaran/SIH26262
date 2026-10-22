'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ArrowRight,
  Building,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { STAGE_LABELS } from '@/lib/types';

import { Role } from '@/lib/types';

interface ApplicationsDirectoryProps {
  applications: any[];
  onSelectApplication: (app: any) => void;
  currentRole?: Role;
}

export const ApplicationsDirectory: React.FC<ApplicationsDirectoryProps> = ({
  applications,
  onSelectApplication,
  currentRole = 'REGULATION_BUREAU_ADMIN',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>(
    currentRole === 'RO_OFFICER' ? 'SRO' : 'ALL'
  );
  const [selectedStage, setSelectedStage] = useState<string>(
    currentRole === 'SHC_SAC_COMMITTEE' ? 'SHC_HEARING' : 'ALL'
  );

  const filteredApps = applications.filter((app) => {
    const matchesRegion =
      selectedRegion === 'ALL' || app.institution?.region === selectedRegion;
    const matchesStage =
      selectedStage === 'ALL' || app.currentStage === selectedStage;
    const matchesSearch =
      !searchQuery ||
      app.applicationNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution?.aictePid?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesStage && matchesSearch;
  });

  const getPageTitle = () => {
    if (currentRole === 'RO_OFFICER') return 'Regional Applications Registry (SRO)';
    if (currentRole === 'SHC_SAC_COMMITTEE') return 'Standing Hearing Docket & Appeals';
    return 'Applications Registry';
  };

  const getPageSubtitle = () => {
    if (currentRole === 'RO_OFFICER')
      return 'Regional intake, TER fee verification, and post-EVC processing for Southern Regional Office';
    if (currentRole === 'SHC_SAC_COMMITTEE')
      return 'Referred deficit institutions and appellate hearings under APH 2024–27 Chapter 1';
    return 'Central repository of technical institution approval applications across all 8 AICTE regions';
  };

  return (
    <div className="space-y-4 max-w-[1216px] mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            {getPageSubtitle()}
          </p>
        </div>
        <span className="text-[12px] font-medium text-[#5E6C84] bg-white border border-[#DDE1E5] px-2.5 py-1 rounded">
          Total: {filteredApps.length} Records
        </span>
      </div>

      {/* Filter Bar */}
      <div className="enterprise-panel p-3 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8993A4]" />
            <input
              type="text"
              placeholder="Search by PID, App No, or Institution name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
            />
          </div>

          {/* Region */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91] pr-7 cursor-pointer appearance-none"
            >
              <option value="ALL">All Regions (8)</option>
              <option value="NWRO">NWRO Chandigarh</option>
              <option value="NRO">NRO Kanpur</option>
              <option value="WRO">WRO Mumbai</option>
              <option value="CRO">CRO Bhopal</option>
              <option value="ERO">ERO Kolkata</option>
              <option value="SCRO">SCRO Hyderabad</option>
              <option value="SRO">SRO Chennai</option>
              <option value="SWRO">SWRO Bengaluru</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#5E6C84] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Stage */}
          <div className="relative">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91] pr-7 cursor-pointer appearance-none"
            >
              <option value="ALL">All Workflow Stages</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="SCRUTINY">Scrutiny</option>
              <option value="RE_SCRUTINY">Re-Scrutiny</option>
              <option value="EVC_SCHEDULED">EVC Scheduled</option>
              <option value="EVC_COMPLETED">EVC Completed</option>
              <option value="SHC_HEARING">SHC Hearing</option>
              <option value="LOA_GRANTED">LoA / EoA Granted</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#5E6C84] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="enterprise-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="py-2.5 px-3.5 font-semibold">Application ID & PID</th>
                <th className="py-2.5 px-3.5 font-semibold">Institution Name</th>
                <th className="py-2.5 px-3.5 font-semibold">Region</th>
                <th className="py-2.5 px-3.5 font-semibold">Track</th>
                <th className="py-2.5 px-3.5 font-semibold">Current Stage</th>
                <th className="py-2.5 px-3.5 font-semibold">SLA Target</th>
                <th className="py-2.5 px-3.5 font-semibold">Ageing</th>
                <th className="py-2.5 px-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F4] text-[12px]">
              {filteredApps.map((app) => {
                const isOverdue = app.isOverdue;
                const deadline = new Date(app.slaDeadline).toLocaleDateString();

                return (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="table-row cursor-pointer"
                  >
                    <td className="py-2.5 px-3.5 font-mono">
                      <div className="font-semibold text-[#245A91]">{app.applicationNo}</div>
                      <div className="text-[11px] text-[#5E6C84]">PID: {app.institution?.aictePid}</div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="font-medium text-[#172B4D]">{app.institution?.name}</div>
                      <div className="text-[11px] text-[#5E6C84]">
                        {app.institution?.city}, {app.institution?.state}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-[#5E6C84]">
                      {app.institution?.region}
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] font-mono text-[#5E6C84]">
                      {app.aphTrack}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F4F5F7] border border-[#DDE1E5] text-[#172B4D]">
                        {STAGE_LABELS[app.currentStage] || app.currentStage}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {isOverdue ? (
                        <span className="text-[#DC2626] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                          Overdue ({deadline})
                        </span>
                      ) : (
                        <span className="text-[#5E6C84]">{deadline}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-[#5E6C84]">
                      {app.ageingDays}d
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApplication(app);
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-[#F4F5F7] border border-[#DDE1E5] text-[11px] text-[#245A91] font-medium"
                      >
                        Inspect
                      </button>
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
