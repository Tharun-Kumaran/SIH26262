'use client';

import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  User,
  FastForward,
  CheckCircle2,
  LogIn,
  BookOpen,
} from 'lucide-react';
import { Role } from '@/lib/types';
import { NavTab } from './Sidebar';

interface TopHeaderProps {
  currentTab: NavTab;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onFastForward: () => void;
  isFastForwarding: boolean;
  onRefresh: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  currentRole,
  onRoleChange,
  onFastForward,
  isFastForwarding,
  onRefresh,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);

  const getDepartmentName = (role: Role) => {
    switch (role) {
      case 'INSTITUTE_USER':
        return 'Institution Portal';
      case 'SCRUTINY_COMMITTEE':
        return 'Regional Scrutiny Cell';
      case 'EVC_EXPERT':
        return 'EVC Inspection Desk';
      case 'RO_OFFICER':
        return 'Regional Office (RO)';
      case 'SHC_SAC_COMMITTEE':
        return 'Hearing & Appeals Bureau';
      case 'REGULATION_BUREAU_ADMIN':
      default:
        return 'Regulation Bureau';
    }
  };

  const getBreadcrumb = () => {
    switch (currentTab) {
      case 'overview':
        return currentRole === 'RO_OFFICER' ? 'Regional Overview' : 'National Overview';
      case 'applications':
        return 'Applications Pipeline';
      case 'scrutiny':
        return 'Document Scrutiny Workstation';
      case 'evc':
        return 'EVC Inspection Scheduling';
      case 'compliance':
        return currentRole === 'INSTITUTE_USER' ? 'My Application Status & Pipeline' : 'Statutory Compliance';
      case 'documents':
        return currentRole === 'INSTITUTE_USER' ? 'My Statutory Documents' : 'Document Registry';
      case 'reports':
        return 'Analytical Reports';
      case 'rules':
        return 'Workflow & SLA Rules';
      case 'audit':
        return 'Immutable Audit Trail';
      case 'readme':
        return 'System Guide & Specifications (README)';
      default:
        return 'Overview';
    }
  };

  const roles: { id: Role; label: string; shortLabel: string }[] = [
    { id: 'REGULATION_BUREAU_ADMIN', label: 'Regulation Bureau Administrator (HQ)', shortLabel: 'HQ Bureau Admin' },
    { id: 'RO_OFFICER', label: 'Regional Officer (RO SRO/WRO)', shortLabel: 'Regional Officer' },
    { id: 'SCRUTINY_COMMITTEE', label: 'Scrutiny Committee Chair', shortLabel: 'Scrutiny Chair' },
    { id: 'EVC_EXPERT', label: 'EVC Lead Inspector', shortLabel: 'EVC Inspector' },
    { id: 'SHC_SAC_COMMITTEE', label: 'Standing Hearing Committee', shortLabel: 'Hearing Committee' },
    { id: 'INSTITUTE_USER', label: 'Institute User (PID Holder)', shortLabel: 'Institute PID User' },
  ];

  const currentRoleInfo = roles.find((r) => r.id === currentRole) || roles[0];
  const canSimulateCron = currentRole === 'REGULATION_BUREAU_ADMIN' || currentRole === 'RO_OFFICER';

  return (
    <header className="h-[52px] bg-white border-b border-[#DDE1E5] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left Breadcrumbs with Role Department */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#5E6C84]">
        <span className="font-normal text-[#5E6C84]">{getDepartmentName(currentRole)}</span>
        <span className="text-[#8993A4]">/</span>
        <span className="font-medium text-[#172B4D]">{getBreadcrumb()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Simulate Fast-Forward Button ONLY for Admin and RO Officer */}
        {canSimulateCron && (
          <button
            onClick={onFastForward}
            disabled={isFastForwarding}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#172B4D] border border-[#DDE1E5] rounded text-[12px] font-medium transition-colors disabled:opacity-60"
            title="Fast-forward simulation (+7 days) to test automatic SLA breach alerts and HQ escalation"
          >
            <FastForward className={`w-3.5 h-3.5 text-[#245A91] ${isFastForwarding ? 'animate-spin' : ''}`} />
            <span>{isFastForwarding ? 'Scanning...' : 'Simulate Cron (+7d)'}</span>
          </button>
        )}

        {/* Demo Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE1E5] rounded text-[12px] text-[#172B4D] font-normal hover:bg-[#FAFBFC] transition-colors"
          >
            <span className="text-[#5E6C84]">Active Role:</span>
            <span className="font-medium">{currentRoleInfo.shortLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#5E6C84] ml-0.5" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-[#DDE1E5] rounded shadow-md py-1 z-30">
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-[#8993A4] border-b border-[#F0F2F4] flex items-center justify-between">
                <span>Switch RBAC Authority</span>
                <a
                  href="/login"
                  className="text-[#245A91] hover:underline normal-case text-[11px] font-medium flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Login Portal</span>
                </a>
              </div>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onRoleChange(r.id);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between hover:bg-[#F4F5F7] transition-colors ${
                    currentRole === r.id ? 'bg-[#EFF5FB] text-[#245A91] font-medium' : 'text-[#172B4D]'
                  }`}
                >
                  <span className="font-medium">{r.label}</span>
                  {currentRole === r.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#245A91] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* README / System Guide Link */}
        <a
          href="/readme"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-[#F4F5F7] text-[#245A91] border border-[#D3DFED] rounded text-[12px] font-medium transition-colors"
          title="Open System Documentation and Technical Specifications"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">README / Guide</span>
        </a>

        {/* Role Sign-In Link */}
        <a
          href="/login"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-[#F4F5F7] text-[#5E6C84] hover:text-[#172B4D] border border-[#DDE1E5] rounded text-[12px] font-medium transition-colors"
          title="Open Role Login & Switcher Portal"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Role Logins</span>
        </a>

        {/* Notification Bell */}
        <button
          className="relative p-1.5 rounded hover:bg-[#F4F5F7] text-[#5E6C84] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 stroke-[1.75]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DC2626]" />
        </button>

        {/* Role Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#DDE1E5]">
          <div className="w-7 h-7 rounded bg-[#E9EEF4] border border-[#D3DFED] flex items-center justify-center text-[#245A91] text-[10px] font-semibold font-mono">
            {currentRole === 'INSTITUTE_USER' ? 'PID' : currentRole.substring(0, 2)}
          </div>
          <span className="text-[12px] font-medium text-[#172B4D] hidden md:inline">
            {currentRoleInfo.shortLabel}
          </span>
        </div>
      </div>
    </header>
  );
};
