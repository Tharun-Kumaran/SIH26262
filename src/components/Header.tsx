'use client';

import React from 'react';
import {
  ShieldAlert,
  FastForward,
  Building2,
  FileCheck2,
  Compass,
  School,
  History,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Role } from '@/lib/types';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onFastForward: () => void;
  isFastForwarding: boolean;
  onOpenAuditLogs: () => void;
  onRefresh: () => void;
  lastUpdated: Date;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onFastForward,
  isFastForwarding,
  onOpenAuditLogs,
  onRefresh,
  lastUpdated,
}) => {
  const roles: { id: Role; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'REGULATION_BUREAU_ADMIN',
      label: 'HQ Bureau Admin',
      icon: <Building2 className="w-4 h-4" />,
      desc: 'National Pendency, SLA Rules & HQ Oversight',
    },
    {
      id: 'RO_OFFICER',
      label: 'RO / Scrutiny Portal',
      icon: <FileCheck2 className="w-4 h-4" />,
      desc: 'Split-Screen Verifier & Re-Scrutiny Engine',
    },
    {
      id: 'EVC_EXPERT',
      label: 'EVC Portal',
      icon: <Compass className="w-4 h-4" />,
      desc: 'Inspection Queue & GPS Lock Report',
    },
    {
      id: 'INSTITUTE_USER',
      label: 'Institute PID Portal',
      icon: <School className="w-4 h-4" />,
      desc: 'Live Application Tracker & Affidavit-2',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      {/* Top AICTE Branding Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 font-bold text-slate-950 text-xs shadow-md">
            AICTE
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-semibold text-slate-200 tracking-wide uppercase">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-amber-400 font-medium">Regulation Bureau (APH 2024-27)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SLA ENGINE ACTIVE
          </div>

          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={onRefresh}
              title="Refresh Data"
              className="ml-1 p-1 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700/50 text-blue-300 text-[11px] font-mono font-semibold">
            PS ID: 26262
          </div>
        </div>
      </div>

      {/* Main Navbar with Role Switcher & Action Button */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700/40">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AICTE Compliance & Approval Engine
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PROTOTYPE
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              State-Machine Routing • SLA Escalation • Geotagged EVC • Time-Bound Compliance
            </p>
          </div>
        </div>

        {/* Action Controls: Fast-Forward Button + Audit Log */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAuditLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-medium transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={onFastForward}
            disabled={isFastForwarding}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold shadow-lg shadow-orange-950/50 border border-amber-400/40 transition-all active:scale-95 disabled:opacity-60"
            title="Fast-forward time by 7 days to simulate overdue SLA breaches, document expiries, and automatic HQ escalations"
          >
            <FastForward className={`w-4 h-4 ${isFastForwarding ? 'animate-spin' : ''}`} />
            <span>{isFastForwarding ? 'Simulating...' : 'Fast-Forward Time (+7 Days)'}</span>
            <Sparkles className="w-3 h-3 text-amber-200" />
          </button>
        </div>
      </div>

      {/* Role Switcher Tab Strip */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-1.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between overflow-x-auto gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
            Demo RBAC Switcher:
          </span>
          <div className="flex items-center gap-1.5">
            {roles.map((r) => {
              const active = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onRoleChange(r.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span className={active ? 'text-amber-300' : 'text-slate-400'}>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
