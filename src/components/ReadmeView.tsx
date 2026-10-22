'use client';

import React from 'react';
import {
  BookOpen,
  Shield,
  FileCheck2,
  Compass,
  AlertTriangle,
  History,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export const ReadmeView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1020px] mx-auto pb-10">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE1E5]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#172B4D] tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#245A91]" />
            AICTE Regulatory Control Tower • System Documentation
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            Technical specifications, RBAC role matrix, state-machine routing rules, and evaluation guide (SIH PS: 26262)
          </p>
        </div>

        <a
          href="/login"
          className="px-3 py-1.5 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium transition-colors shadow-sm"
        >
          Open Role Login Portal
        </a>
      </div>

      {/* 1. Problem Statement Card */}
      <div className="enterprise-panel p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#EFF5FB] border border-[#D3DFED] text-[#245A91] text-[11px] font-mono font-medium">
            PROBLEM STATEMENT 26262
          </span>
          <span className="text-[12px] text-[#5E6C84]">Ministry of Education • AICTE Regulation Bureau</span>
        </div>
        <h2 className="text-[15px] font-semibold text-[#172B4D]">
          Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System
        </h2>
        <p className="text-[12px] text-[#5E6C84] leading-relaxed">
          Technical institutions in India require statutory approval under the AICTE Approval Process Handbook (APH 2024–27).
          This enterprise software automates application state-machine transitions across all 8 Regional Offices, enforces turnaround SLAs, detects approaching document expiries, auto-escalates overdue cases to Headquarters, and guarantees an immutable audit trail.
        </p>
      </div>

      {/* 2. RBAC Roles Matrix (Roles Only) */}
      <div className="enterprise-panel p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#172B4D] uppercase tracking-wide">
          1. Role-Based Access Control (RBAC) Authority Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="table-header">
                <th className="py-2 px-3 font-semibold">Role Designation</th>
                <th className="py-2 px-3 font-semibold">Jurisdiction / Scope</th>
                <th className="py-2 px-3 font-semibold">Permitted Actions & Workflows</th>
                <th className="py-2 px-3 font-semibold">Default Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F4]">
              <tr className="table-row">
                <td className="py-2.5 px-3 font-medium text-[#172B4D]">
                  Regulation Bureau Administrator
                </td>
                <td className="py-2.5 px-3 text-[#5E6C84]">AICTE HQ (New Delhi)</td>
                <td className="py-2.5 px-3 text-[#5E6C84]">
                  National pendency oversight, APH SLA rules matrix configuration, Level-2 auto-escalations, and immutable audit trail oversight.
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#245A91]">Overview</td>
              </tr>
              <tr className="table-row">
                <td className="py-2.5 px-3 font-medium text-[#172B4D]">
                  Regional Officer (RO)
                </td>
                <td className="py-2.5 px-3 text-[#5E6C84]">8 Regional Offices (NWRO, NRO, WRO, CRO, ERO, SCRO, SRO, SWRO)</td>
                <td className="py-2.5 px-3 text-[#5E6C84]">
                  TER fee clearance (₹1.5L–₹3L), regional committee allocation, post-EVC review, and referral to SHC hearings.
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#245A91]">Applications</td>
              </tr>
              <tr className="table-row">
                <td className="py-2.5 px-3 font-medium text-[#172B4D]">
                  Scrutiny Committee Chair
                </td>
                <td className="py-2.5 px-3 text-[#5E6C84]">Regional Scrutiny Cells</td>
                <td className="py-2.5 px-3 text-[#5E6C84]">
                  Split-screen verification of Land Lease Deeds, Fire NOCs, stability certs, and 1-click revert to Re-Scrutiny with mandatory deficiency tags.
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#245A91]">Scrutiny</td>
              </tr>
              <tr className="table-row">
                <td className="py-2.5 px-3 font-medium text-[#172B4D]">
                  EVC Lead Inspector
                </td>
                <td className="py-2.5 px-3 text-[#5E6C84]">Expert Visit Committee Panel</td>
                <td className="py-2.5 px-3 text-[#5E6C84]">
                  On-site physical and virtual inspections, site parameter verification, and inspection report submission with geotagged GPS lock.
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#245A91]">EVC Scheduling</td>
              </tr>
              <tr className="table-row">
                <td className="py-2.5 px-3 font-medium text-[#172B4D]">
                  Standing Hearing Committee (SHC)
                </td>
                <td className="py-2.5 px-3 text-[#5E6C84]">Appellate & Hearing Bureau</td>
                <td className="py-2.5 px-3 text-[#5E6C84]">
                  Quasi-judicial formal hearings for institutions flagged with norm deficits; issues conditional approvals with undertakings.
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#245A91]">Overview</td>
              </tr>
              <tr className="table-row">
                <td className="py-2.5 px-3 font-medium text-[#172B4D]">
                  Institute User (PID Holder)
                </td>
                <td className="py-2.5 px-3 text-[#5E6C84]">Technical Institutions Across India</td>
                <td className="py-2.5 px-3 text-[#5E6C84]">
                  Live approval pipeline tracking, statutory document expiry alerts (T-15, T-5 days, Overdue), and Affidavit-2 compliance proof uploader.
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#245A91]">Compliance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. APH Routing Matrix */}
      <div className="enterprise-panel p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#172B4D] uppercase tracking-wide">
          2. APH 2024-27 Statutory Workflow Tracks
        </h2>
        <div className="space-y-2 text-[12px]">
          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded">
            <span className="font-semibold text-[#245A91] block">
              Track 1: NEW_INSTITUTE (Chapter I - Letter of Approval)
            </span>
            <div className="font-mono text-[11px] text-[#5E6C84] mt-1">
              SUBMITTED ──▶ SCRUTINY ──▶ [RE_SCRUTINY] ──▶ EVC_INSPECTION ──▶ [SHC_HEARING] ──▶ LOA_GRANTED
            </div>
            <p className="text-[#5E6C84] text-[11px] mt-1">
              Full scrutiny + physical on-site EVC inspection with strict land, carpet area, and faculty cadre compliance.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded">
            <span className="font-semibold text-[#245A91] block">
              Track 2: EOA_STANDARD (Chapter II - Extension of Approval)
            </span>
            <div className="font-mono text-[11px] text-[#5E6C84] mt-1">
              SUBMITTED ──▶ SCRUTINY ──▶ EOA_GRANTED (Routes to EVC only if flagged for deficiency / undertaking breach)
            </div>
            <p className="text-[#5E6C84] text-[11px] mt-1">
              Annual self-disclosure verification. Standard applications achieve approval directly upon compliant scrutiny.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded">
            <span className="font-semibold text-[#245A91] block">
              Track 3: EOA_3YEAR_MERIT (APH 2024-27 Special Merit Track)
            </span>
            <div className="font-mono text-[11px] text-[#5E6C84] mt-1">
              SUBMITTED ──▶ AUTOMATED_ELIGIBILITY_CHECK (NIRF/NBA/NAAC) ──▶ EOA_3YEAR_GRANTED
            </div>
            <p className="text-[#5E6C84] text-[11px] mt-1">
              Expedited 3-year approval for institutions with high NIRF rankings and NBA/NAAC accreditation.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded">
            <span className="font-semibold text-[#245A91] block">
              Track 4: INFRA_MODIFICATION (Chapter III - Change of Site / Conversion)
            </span>
            <div className="font-mono text-[11px] text-[#5E6C84] mt-1">
              SUBMITTED ──▶ EVC_INSPECTION ──▶ [SHC_HEARING] ──▶ APPROVED
            </div>
            <p className="text-[#5E6C84] text-[11px] mt-1">
              Bypasses preliminary scrutiny and routes directly to EVC site inspection for built-environment verification.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Core Backend Engines */}
      <div className="enterprise-panel p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#172B4D] uppercase tracking-wide">
          3. Core Backend Engines & Endpoints
        </h2>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded space-y-1">
            <span className="font-mono text-[#245A91] font-semibold">/api/workflow/transition</span>
            <div className="text-[11px] font-semibold text-[#172B4D]">Dynamic State-Machine Engine</div>
            <p className="text-[#5E6C84] text-[11px]">
              Validates role permissions, validates next allowed stages against WorkflowRule, enforces mandatory deficiency tagging on revert, recalculates SLA deadlines, and writes an append-only AuditLog.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded space-y-1">
            <span className="font-mono text-[#245A91] font-semibold">/api/cron/run-checks</span>
            <div className="text-[11px] font-semibold text-[#172B4D]">Automated Compliance & Escalation Engine</div>
            <p className="text-[#5E6C84] text-[11px]">
              Scans active applications for SLA breaches, expiring Lease Deeds, Fire NOCs, and overdue undertakings. Supports +7 Days Fast-Forward simulation and escalates overdue cases to Level-2 HQ.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded space-y-1">
            <span className="font-mono text-[#245A91] font-semibold">/api/rules</span>
            <div className="text-[11px] font-semibold text-[#172B4D]">Configurable Governance Matrix</div>
            <p className="text-[#5E6C84] text-[11px]">
              Allows Regulation Bureau Admins to adjust turnaround days per stage and track in real time, with immediate database persistence.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] border border-[#DDE1E5] rounded space-y-1">
            <span className="font-mono text-[#245A91] font-semibold">/api/evc</span>
            <div className="text-[11px] font-semibold text-[#172B4D]">Geotagged Inspection Engine</div>
            <p className="text-[#5E6C84] text-[11px]">
              Schedules Physical and Virtual inspections, locks site GPS coordinates with 99.8% precision, and automatically routes reports to LoA or SHC hearings.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Evaluator Walkthrough */}
      <div className="enterprise-panel p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#172B4D] uppercase tracking-wide">
          4. Step-by-Step Evaluation Guide for Judges
        </h2>
        <div className="space-y-2 text-[12px]">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded bg-[#EFF5FB] text-[#245A91] font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
            <div>
              <span className="font-semibold text-[#172B4D]">Inspect National Overview:</span> View 4 KPI metrics (`128`, `34`, `12`, `7`), 8 regional pendency horizontal bars, and the operational priority table.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded bg-[#EFF5FB] text-[#245A91] font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
            <div>
              <span className="font-semibold text-[#172B4D]">Trigger Live Fast-Forward (+7d):</span> Click `Simulate Cron (+7d)` in the top header to demonstrate real-time algorithmic SLA breach detection, document expiry surveillance, and automated Level-2 HQ escalation.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded bg-[#EFF5FB] text-[#245A91] font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
            <div>
              <span className="font-semibold text-[#172B4D]">Verify Split-Screen Scrutiny:</span> In `Scrutiny`, inspect Land Lease Deeds, click `Verify Document`, or click `Revert for Re-Scrutiny with Deficiency Tag` to reset turnaround to 4 days.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded bg-[#EFF5FB] text-[#245A91] font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
            <div>
              <span className="font-semibold text-[#172B4D]">Test Geotagged EVC Reporting:</span> In `EVC Scheduling`, click `Submit Report`, capture site GPS coordinates, and submit recommendation.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded bg-[#EFF5FB] text-[#245A91] font-bold text-[11px] flex items-center justify-center shrink-0">5</span>
            <div>
              <span className="font-semibold text-[#172B4D]">Upload Affidavit-2 Compliance:</span> In `Compliance`, review statutory expiry alerts and upload proof for pending undertakings.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded bg-[#EFF5FB] text-[#245A91] font-bold text-[11px] flex items-center justify-center shrink-0">6</span>
            <div>
              <span className="font-semibold text-[#172B4D]">Review Immutable Audit Trail:</span> In `Audit Trail`, inspect the cryptographic chronological ledger with SHA-256 entry hashes and actor tags.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
