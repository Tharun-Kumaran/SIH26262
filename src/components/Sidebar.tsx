'use client';

import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  FileCheck,
  CalendarCheck,
  ShieldAlert,
  FileText,
  BarChart3,
  Sliders,
  History,
  Shield,
  User,
  LogIn,
  BookOpen,
} from 'lucide-react';
import { Role } from '@/lib/types';

export type NavTab =
  | 'overview'
  | 'applications'
  | 'scrutiny'
  | 'evc'
  | 'compliance'
  | 'documents'
  | 'reports'
  | 'rules'
  | 'audit'
  | 'readme';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentRole?: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentRole = 'REGULATION_BUREAU_ADMIN',
}) => {
  // Strict Role-Based Navigation Items
  const getNavItemsForRole = (role: Role) => {
    switch (role) {
      case 'INSTITUTE_USER':
        return [
          { id: 'compliance' as NavTab, label: 'My Application Pipeline', icon: <LayoutDashboard className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'documents' as NavTab, label: 'My Statutory Documents', icon: <FileText className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'readme' as NavTab, label: 'System Guide / README', icon: <BookOpen className="w-4 h-4 stroke-[1.75]" /> },
        ];

      case 'SCRUTINY_COMMITTEE':
        return [
          { id: 'scrutiny' as NavTab, label: 'Scrutiny Workstation', icon: <FileCheck className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'documents' as NavTab, label: 'Document Registry', icon: <FileText className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'readme' as NavTab, label: 'System Guide / README', icon: <BookOpen className="w-4 h-4 stroke-[1.75]" /> },
        ];

      case 'EVC_EXPERT':
        return [
          { id: 'evc' as NavTab, label: 'Assigned Inspections', icon: <CalendarCheck className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'readme' as NavTab, label: 'System Guide / README', icon: <BookOpen className="w-4 h-4 stroke-[1.75]" /> },
        ];

      case 'RO_OFFICER':
        return [
          { id: 'overview' as NavTab, label: 'Regional Overview', icon: <LayoutDashboard className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'applications' as NavTab, label: 'Regional Applications', icon: <FolderGit2 className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'scrutiny' as NavTab, label: 'Scrutiny Monitoring', icon: <FileCheck className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'evc' as NavTab, label: 'EVC Coordination', icon: <CalendarCheck className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'reports' as NavTab, label: 'Regional Reports', icon: <BarChart3 className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'readme' as NavTab, label: 'System Guide / README', icon: <BookOpen className="w-4 h-4 stroke-[1.75]" /> },
        ];

      case 'SHC_SAC_COMMITTEE':
        return [
          { id: 'overview' as NavTab, label: 'Hearing Docket', icon: <LayoutDashboard className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'applications' as NavTab, label: 'Referred Deficit Cases', icon: <FolderGit2 className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'readme' as NavTab, label: 'System Guide / README', icon: <BookOpen className="w-4 h-4 stroke-[1.75]" /> },
        ];

      case 'REGULATION_BUREAU_ADMIN':
      default:
        return [
          { id: 'overview' as NavTab, label: 'National Overview', icon: <LayoutDashboard className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'applications' as NavTab, label: 'Applications Registry', icon: <FolderGit2 className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'scrutiny' as NavTab, label: 'Scrutiny Operations', icon: <FileCheck className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'evc' as NavTab, label: 'EVC Scheduling', icon: <CalendarCheck className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'compliance' as NavTab, label: 'Compliance Monitoring', icon: <ShieldAlert className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'documents' as NavTab, label: 'Documents Archive', icon: <FileText className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'reports' as NavTab, label: 'Analytical Reports', icon: <BarChart3 className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'rules' as NavTab, label: 'Workflow & SLA Rules', icon: <Sliders className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'audit' as NavTab, label: 'Audit Trail', icon: <History className="w-4 h-4 stroke-[1.75]" /> },
          { id: 'readme' as NavTab, label: 'System Guide / README', icon: <BookOpen className="w-4 h-4 stroke-[1.75]" /> },
        ];
    }
  };

  const navItems = getNavItemsForRole(currentRole);

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'REGULATION_BUREAU_ADMIN':
        return 'Regulation Bureau Admin';
      case 'RO_OFFICER':
        return 'Regional Officer (RO)';
      case 'SCRUTINY_COMMITTEE':
        return 'Scrutiny Committee Chair';
      case 'EVC_EXPERT':
        return 'EVC Lead Inspector';
      case 'SHC_SAC_COMMITTEE':
        return 'Hearing Committee';
      case 'INSTITUTE_USER':
        return 'Institute PID Holder';
      default:
        return 'Regulation Bureau Admin';
    }
  };

  const getPortalSubtitle = (role: Role) => {
    switch (role) {
      case 'INSTITUTE_USER':
        return 'INSTITUTE PORTAL';
      case 'SCRUTINY_COMMITTEE':
        return 'SCRUTINY CELL';
      case 'EVC_EXPERT':
        return 'INSPECTION DESK';
      case 'RO_OFFICER':
        return 'REGIONAL OFFICE';
      case 'SHC_SAC_COMMITTEE':
        return 'HEARING BUREAU';
      case 'REGULATION_BUREAU_ADMIN':
      default:
        return 'REGULATION BUREAU';
    }
  };

  return (
    <aside className="w-[224px] min-w-[224px] bg-[#142B49] text-white flex flex-col justify-between h-screen sticky top-0 select-none z-30 border-r border-[#0D1E34]">
      {/* Brand Header */}
      <div>
        <div className="px-4 py-4 border-b border-[#1D3B63]/70 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#1D3B63] border border-[#2B5488] flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight text-white">
              Approval Operations
            </div>
            <div className="text-[10px] font-medium tracking-wider text-[#8FA3BF] uppercase">
              {getPortalSubtitle(currentRole)}
            </div>
          </div>
        </div>

        {/* Role Badge Tag */}
        <div className="px-3 pt-2 pb-1">
          <div className="text-[10px] font-mono text-[#8FA3BF] uppercase px-1">
            Access Scope: {currentRole}
          </div>
        </div>

        {/* Dynamic Navigation List strictly for this role */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-[13px] font-normal transition-colors text-left ${
                  isActive
                    ? 'bg-[#1D3B63] text-white font-medium shadow-sm'
                    : 'text-[#C3CFDE] hover:bg-[#1A3456]/60 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#8FA3BF]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Role / Console indicator & Login link */}
      <div className="p-3 border-t border-[#1D3B63]/70 bg-[#0F223B]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded bg-[#1D3B63] border border-[#2B5488] flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
            <User className="w-3.5 h-3.5 text-[#8FA3BF]" />
          </div>
          <div className="truncate text-left leading-tight">
            <div className="text-[11px] font-medium text-white truncate">
              {getRoleLabel(currentRole)}
            </div>
            <div className="text-[10px] text-[#8FA3BF] truncate font-mono">
              Role Authorized
            </div>
          </div>
        </div>

        <a
          href="/login"
          className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-[#1D3B63] hover:bg-[#245A91] text-[11px] font-medium text-white transition-colors"
          title="Sign in as a different operational role"
        >
          <LogIn className="w-3 h-3 text-[#F59E0B]" />
          <span>Switch Role / Log In</span>
        </a>
      </div>
    </aside>
  );
};
