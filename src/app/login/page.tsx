'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Building2,
  FileCheck2,
  Compass,
  School,
  Scale,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Role } from '@/lib/types';

interface DemoPersona {
  role: Role;
  roleTitle: string;
  office: string;
  email: string;
  description: string;
  icon: React.ReactNode;
}

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('REGULATION_BUREAU_ADMIN');

  const personas: DemoPersona[] = [
    {
      role: 'REGULATION_BUREAU_ADMIN',
      roleTitle: 'Regulation Bureau Administrator',
      office: 'AICTE Headquarters, New Delhi',
      email: 'hq.admin@aicte-india.org',
      description: 'National pendency oversight, APH SLA rules matrix configuration, Level-2 auto-escalations and audit ledger oversight.',
      icon: <Building2 className="w-5 h-5 text-[#245A91]" />,
    },
    {
      role: 'RO_OFFICER',
      roleTitle: 'Regional Officer (RO)',
      office: 'Southern Regional Office (SRO)',
      email: 'ro.sro@aicte-india.org',
      description: 'Regional intake administration, TER fee verification, scrutiny assignment, and post-EVC processing.',
      icon: <Building2 className="w-5 h-5 text-[#245A91]" />,
    },
    {
      role: 'SCRUTINY_COMMITTEE',
      roleTitle: 'Scrutiny Committee Chair',
      office: 'Regional Scrutiny Cell',
      email: 'scrutiny.chair@aicte-india.org',
      description: 'Split-screen verification of Land Lease Deeds, Fire NOCs, stability certs, and 1-click deficiency reverts.',
      icon: <FileCheck2 className="w-5 h-5 text-[#245A91]" />,
    },
    {
      role: 'EVC_EXPERT',
      roleTitle: 'EVC Lead Inspector',
      office: 'Expert Visit Committee Panel',
      email: 'evc.expert@aicte-india.org',
      description: 'Physical & virtual inspections, campus infrastructure check, and geotagged GPS lock report submission.',
      icon: <Compass className="w-5 h-5 text-[#245A91]" />,
    },
    {
      role: 'SHC_SAC_COMMITTEE',
      roleTitle: 'Standing Hearing Committee (SHC)',
      office: 'Appellate & Hearing Bureau',
      email: 'shc.member@aicte-india.org',
      description: 'Formal quasi-judicial hearings for deficient institutions and issuance of conditional approvals with undertakings.',
      icon: <Scale className="w-5 h-5 text-[#245A91]" />,
    },
    {
      role: 'INSTITUTE_USER',
      roleTitle: 'Institute User (PID Holder)',
      office: 'Technical Institution (PID: 1-1029384751)',
      email: 'institute.pid@aicte-india.org',
      description: 'Live approval pipeline tracker, statutory expiry alerts, and Affidavit-2 compliance proof uploader.',
      icon: <School className="w-5 h-5 text-[#245A91]" />,
    },
  ];

  const handleLogin = (roleToLogin: Role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aicte_current_role', roleToLogin);
    }
    router.push(`/?role=${roleToLogin}`);
  };

  const activePersona = personas.find((p) => p.role === selectedRole);

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#172B4D] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-[52px] bg-white border-b border-[#DDE1E5] px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#1D3B63] border border-[#2B5488] flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="leading-tight">
            <span className="text-[13px] font-semibold text-[#172B4D]">
              All India Council for Technical Education
            </span>
            <span className="text-[#8993A4] text-[12px] ml-2 hidden sm:inline">
              Regulation Bureau • Role Sign-In Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/readme"
            className="text-[12px] text-[#245A91] hover:underline font-medium"
          >
            System Guide / README
          </a>
          <span className="text-[11px] font-mono text-[#5E6C84] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#DDE1E5]">
            SIH 2026 • PS 26262
          </span>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 max-w-[1020px] w-full mx-auto px-6 py-8 space-y-6">
        {/* Banner */}
        <div className="text-center space-y-1">
          <h1 className="text-[22px] font-semibold text-[#172B4D] tracking-tight">
            AICTE Regulatory Control Tower • Role Sign-In
          </h1>
          <p className="text-[13px] text-[#5E6C84] max-w-xl mx-auto">
            Select a verified administrative or institutional role to launch the operational dashboard with matching permissions.
          </p>
        </div>

        {/* 6 Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {personas.map((p) => {
            const isSelected = selectedRole === p.role;
            return (
              <div
                key={p.role}
                onClick={() => setSelectedRole(p.role)}
                className={`enterprise-panel p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#245A91] ring-1 ring-[#245A91] shadow-sm bg-white'
                    : 'bg-white hover:border-[#C1C7D0]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-8 h-8 rounded bg-[#EFF5FB] border border-[#D3DFED] flex items-center justify-center shrink-0">
                      {p.icon}
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F4F5F7] border border-[#DDE1E5] text-[#5E6C84]">
                      {p.role}
                    </span>
                  </div>

                  <h2 className="text-[14px] font-semibold text-[#172B4D] mt-2.5">
                    {p.roleTitle}
                  </h2>
                  <div className="text-[11px] text-[#5E6C84] mt-0.5">
                    {p.office}
                  </div>

                  <p className="text-[11px] text-[#5E6C84] mt-2.5 leading-relaxed pt-2 border-t border-[#F0F2F4]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0F2F4] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8993A4] truncate max-w-[130px]">
                    {p.email}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogin(p.role);
                    }}
                    className="px-2.5 py-1 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[11px] font-medium inline-flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credentials / Launch Box */}
        <div className="enterprise-panel p-4 bg-white max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="text-[12px]">
            <span className="text-[#8993A4] text-[10px] uppercase font-semibold block">
              Selected Role
            </span>
            <span className="font-semibold text-[#172B4D] block mt-0.5">
              {activePersona?.roleTitle}
            </span>
            <span className="text-[#5E6C84] font-mono text-[11px]">
              {activePersona?.email} • Authority: {selectedRole}
            </span>
          </div>

          <button
            onClick={() => handleLogin(selectedRole)}
            className="px-4 py-2 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[13px] font-medium inline-flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Launch Dashboard as {activePersona?.roleTitle}</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DDE1E5] bg-white py-3 px-6 text-center text-[11px] text-[#5E6C84] font-mono">
        All India Council for Technical Education • Regulation Bureau • Approval Process Handbook (APH 2024-27)
      </footer>
    </div>
  );
}
