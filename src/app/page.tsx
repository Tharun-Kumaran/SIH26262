'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { NationalOverview } from '@/components/NationalOverview';
import { ApplicationsDirectory } from '@/components/ApplicationsDirectory';
import { ScrutinyPortal } from '@/components/ScrutinyPortal';
import { EVCPortal } from '@/components/EVCPortal';
import { InstitutePortal } from '@/components/InstitutePortal';
import { DocumentsRegistry } from '@/components/DocumentsRegistry';
import { ReportsView } from '@/components/ReportsView';
import { WorkflowRulesView } from '@/components/WorkflowRulesView';
import { ReadmeView } from '@/components/ReadmeView';
import { AuditTrailModal } from '@/components/AuditTrailModal';
import { FastForwardModal } from '@/components/FastForwardModal';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { Role } from '@/lib/types';

const ALLOWED_TABS_BY_ROLE: Record<Role, NavTab[]> = {
  INSTITUTE_USER: ['compliance', 'documents', 'readme'],
  SCRUTINY_COMMITTEE: ['scrutiny', 'documents', 'readme'],
  EVC_EXPERT: ['evc', 'readme'],
  RO_OFFICER: ['overview', 'applications', 'scrutiny', 'evc', 'reports', 'readme'],
  SHC_SAC_COMMITTEE: ['overview', 'applications', 'readme'],
  REGULATION_BUREAU_ADMIN: [
    'overview',
    'applications',
    'scrutiny',
    'evc',
    'compliance',
    'documents',
    'reports',
    'rules',
    'audit',
    'readme',
  ],
};

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [currentRole, setCurrentRole] = useState<Role>('REGULATION_BUREAU_ADMIN');
  const [applications, setApplications] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Modals
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showFastForwardModal, setShowFastForwardModal] = useState<boolean>(false);
  const [fastForwardReport, setFastForwardReport] = useState<any>(null);
  const [isFastForwarding, setIsFastForwarding] = useState<boolean>(false);

  // Selected app for detailed inspection
  const [selectedAppId, setSelectedAppId] = useState<string | undefined>();

  // Check URL query param or localStorage for role on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryRole = params.get('role') as Role | null;
      const storedRole = localStorage.getItem('aicte_current_role') as Role | null;
      const effectiveRole = queryRole || storedRole || 'REGULATION_BUREAU_ADMIN';

      if (effectiveRole) {
        setCurrentRole(effectiveRole);
        const allowed = ALLOWED_TABS_BY_ROLE[effectiveRole] || ALLOWED_TABS_BY_ROLE.REGULATION_BUREAU_ADMIN;
        setCurrentTab(allowed[0]);
      }
    }
  }, []);

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aicte_current_role', newRole);
    }
    const allowed = ALLOWED_TABS_BY_ROLE[newRole] || ALLOWED_TABS_BY_ROLE.REGULATION_BUREAU_ADMIN;
    if (!allowed.includes(currentTab)) {
      setCurrentTab(allowed[0]);
    }
  };

  const loadData = useCallback(async () => {
    try {
      const [appsRes, rulesRes, logsRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/rules'),
        fetch('/api/audit-logs'),
      ]);

      const [appsData, rulesData, logsData] = await Promise.all([
        appsRes.json(),
        rulesRes.json(),
        logsRes.json(),
      ]);

      if (appsData.success) setApplications(appsData.data || []);
      if (rulesData.success) setRules(rulesData.data || []);
      if (logsData.success) setAuditLogs(logsData.data || []);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fast-Forward Time (+7 Days) simulation
  const handleFastForward = async () => {
    try {
      setIsFastForwarding(true);
      const res = await fetch('/api/cron/run-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fastForwardDays: 7 }),
      });
      const data = await res.json();
      if (data.success) {
        setFastForwardReport(data.report);
        setShowFastForwardModal(true);
        await loadData();
      }
    } catch {
      alert('Fast forward simulation failed');
    } finally {
      setIsFastForwarding(false);
    }
  };

  const handleSelectApplication = (app: any) => {
    setSelectedAppId(app.id);
    const allowed = ALLOWED_TABS_BY_ROLE[currentRole] || [];
    if (allowed.includes('scrutiny')) {
      setCurrentTab('scrutiny');
    }
  };

  const handleSidebarTab = (tab: NavTab) => {
    const allowed = ALLOWED_TABS_BY_ROLE[currentRole] || [];
    if (!allowed.includes(tab)) {
      return;
    }
    setCurrentTab(tab);
    if (tab === 'audit') {
      setShowAuditModal(true);
    }
  };

  const isTabAuthorized = (ALLOWED_TABS_BY_ROLE[currentRole] || []).includes(currentTab);

  return (
    <div className="min-h-screen flex bg-[#F5F6F7] text-[#172B4D]">
      {/* Fixed 224px Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSidebarTab}
        currentRole={currentRole}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onFastForward={handleFastForward}
          isFastForwarding={isFastForwarding}
          onRefresh={loadData}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-6">
          {!isTabAuthorized ? (
            <div className="max-w-[620px] mx-auto mt-16 enterprise-panel p-8 text-center bg-white border border-[#DDE1E5] rounded shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FEECEB] border border-[#FBC5C2] flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6 text-[#DC2626]" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#DC2626] font-semibold mb-1">
                Access Restricted &bull; AICTE APH Section 1.4 Security Boundary
              </div>
              <h2 className="text-[18px] font-semibold text-[#172B4D] mb-2">
                Unauthorized Operational Module
              </h2>
              <p className="text-[13px] text-[#5E6C84] leading-relaxed mb-6">
                Your active security context does not hold regulatory clearance to access the <span className="font-mono font-medium text-[#172B4D]">[{currentTab}]</span> module. Under the Approval Process Handbook, institutional applicants, inspection panels, and regional scrutiny cells operate with strict role boundaries.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentTab(ALLOWED_TABS_BY_ROLE[currentRole][0])}
                  className="px-4 py-2 bg-[#245A91] hover:bg-[#1D4773] text-white text-[13px] font-medium rounded transition-colors"
                >
                  Go to Authorized Workspace ({ALLOWED_TABS_BY_ROLE[currentRole][0]})
                </button>
                <a
                  href="/login"
                  className="px-4 py-2 bg-white hover:bg-[#F4F5F7] border border-[#DDE1E5] text-[#172B4D] text-[13px] font-medium rounded transition-colors"
                >
                  Switch Role Profile
                </a>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'overview' && (
                <NationalOverview
                  onSelectApplication={handleSelectApplication}
                  onNavigateTab={handleSidebarTab}
                  applications={applications}
                  auditLogs={auditLogs}
                />
              )}

              {currentTab === 'applications' && (
                <ApplicationsDirectory
                  applications={applications}
                  onSelectApplication={handleSelectApplication}
                  currentRole={currentRole}
                />
              )}

              {currentTab === 'scrutiny' && (
                <ScrutinyPortal
                  applications={applications}
                  selectedAppId={selectedAppId}
                  onRefresh={loadData}
                  onSelectApplication={(app) => setSelectedAppId(app.id)}
                  currentRole={currentRole}
                />
              )}

              {currentTab === 'evc' && (
                <EVCPortal
                  applications={applications}
                  onRefresh={loadData}
                  currentRole={currentRole}
                />
              )}

              {currentTab === 'compliance' && (
                <InstitutePortal
                  applications={applications}
                  onRefresh={loadData}
                  currentRole={currentRole}
                />
              )}

              {currentTab === 'documents' && (
                <DocumentsRegistry
                  applications={applications}
                  currentRole={currentRole}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsView applications={applications} />
              )}

              {currentTab === 'rules' && (
                <WorkflowRulesView rules={rules} onRefresh={loadData} />
              )}

              {currentTab === 'readme' && (
                <ReadmeView />
              )}

              {currentTab === 'audit' && (
                <NationalOverview
                  onSelectApplication={handleSelectApplication}
                  onNavigateTab={handleSidebarTab}
                  applications={applications}
                  auditLogs={auditLogs}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Immutable Audit Trail Modal */}
      <AuditTrailModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        auditLogs={auditLogs}
      />

      {/* Fast Forward Modal */}
      <FastForwardModal
        isOpen={showFastForwardModal}
        onClose={() => setShowFastForwardModal(false)}
        report={fastForwardReport}
      />
    </div>
  );
}
