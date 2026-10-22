# AICTE Regulatory Control Tower (Smart India Hackathon 2026 - PS 26262)

> **Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System**  
> Under the AICTE Regulation Bureau (Approval Process Handbook - APH 2024–27).

---

## 1. System Overview

The **AICTE Regulatory Control Tower** is an institutional enterprise case-management and automated compliance platform engineered for the All India Council for Technical Education. It replaces fragmented approval workflows with a deterministic state-machine routing engine, automated turnaround SLA surveillance, algorithmic escalation, and an immutable audit ledger.

### Key Capabilities
- **Multi-Region Coordination**: Centralized oversight across all **8 AICTE Regional Offices** (`NWRO Chandigarh`, `NRO Kanpur`, `WRO Mumbai`, `CRO Bhopal`, `ERO Kolkata`, `SCRO Hyderabad`, `SRO Chennai`, `SWRO Bengaluru`).
- **Dynamic State-Machine Routing**: Enforces strict APH 2024-27 transition matrices, prevents unauthorized jumps, mandates deficiency tagging on reverts, and recalculates SLA target deadlines dynamically.
- **Automated Compliance & Escalation Engine**: Periodically evaluates applications against SLA deadlines, scans for expiring Land Lease Deeds and Fire Safety NOCs, flags breached undertakings, and auto-escalates overdue cases to Headquarters (**Level-2 Show Cause**).
- **Fast-Forward Simulation**: A 1-click `Simulate Cron (+7d)` tool allowing evaluators and judges to simulate 7 days of elapsed time live.
- **Append-Only Immutable Audit Trail**: Records every state transition, document verification, and system cron event with SHA-256 cryptographic hashes.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Operational Role | Institutional Scope | Permitted Actions & Core Workflows |
| :--- | :--- | :--- |
| **`REGULATION_BUREAU_ADMIN`** | AICTE Headquarters (New Delhi) | National pendency oversight, APH SLA rules matrix configuration, Level-2 auto-escalations, and immutable audit trail oversight. |
| **`RO_OFFICER`** | 8 Regional Offices (NWRO–SWRO) | Intake administration, TER fee clearance (₹1.5L–₹3L), assigning regional scrutiny committees, and referring cases post-EVC. |
| **`SCRUTINY_COMMITTEE`** | Regional Scrutiny Cells | Split-screen document verification (Lease Deeds, Fire NOCs, stability certs), and 1-click revert to Re-Scrutiny with mandatory deficiency tags. |
| **`EVC_EXPERT`** | Expert Visit Committee Panel | On-site physical and virtual inspections, site parameter verification, and inspection report submission with geotagged GPS lock. |
| **`SHC_SAC_COMMITTEE`** | Appellate & Hearing Bureau | Quasi-judicial formal hearings for institutions flagged with norm deficits; issues conditional approvals with undertakings. |
| **`INSTITUTE_USER`** | Technical Institutions Across India | Live approval pipeline tracking, statutory document expiry alerts (T-15, T-5 days, Overdue), and Affidavit-2 compliance proof uploader. |

---

## 3. Statutory APH 2024-27 Routing Matrix

```
1. NEW_INSTITUTE (Chapter I - Letter of Approval)
   SUBMITTED ──▶ SCRUTINY ──▶ [RE_SCRUTINY] ──▶ EVC_INSPECTION ──▶ [SHC_HEARING] ──▶ LOA_GRANTED

2. EOA_STANDARD (Chapter II - Extension of Approval)
   SUBMITTED ──▶ SCRUTINY ──▶ EOA_GRANTED (Routes to EVC only if flagged for deficiency / undertaking breach)

3. EOA_3YEAR_MERIT (APH 2024-27 Special Merit Track)
   SUBMITTED ──▶ AUTOMATED_ELIGIBILITY_CHECK (NIRF/NBA/NAAC) ──▶ EOA_3YEAR_GRANTED

4. INFRA_MODIFICATION (Chapter III - Change of Site / Conversion)
   SUBMITTED ──▶ EVC_INSPECTION ──▶ [SHC_HEARING] ──▶ APPROVED
```

---

## 4. Backend Endpoints & API Reference

| Endpoint | Method | Engine Description |
| :--- | :--- | :--- |
| `/api/workflow/transition` | `POST` | Validates role authority, enforces transition rules, mandates deficiency reasons on revert, recalculates SLA deadlines, and writes an AuditLog entry. |
| `/api/cron/run-checks` | `GET`, `POST` | Automated compliance engine scanning for SLA breaches, expiring documents, and overdue undertakings. Supports `fastForwardDays: 7` simulation. |
| `/api/applications` | `GET` | Fetches applications with filtering by region, stage, track, and search query. |
| `/api/rules` | `GET`, `PUT` | Configurable governance rules API allowing real-time modification of SLA days and permitted transitions. |
| `/api/evc` | `POST` | Handles Physical/Virtual EVC inspection scheduling and report submission with simulated GPS lock. |
| `/api/compliance` | `POST` | Handles document verification stamping and Affidavit-2 compliance proof submission. |
| `/api/audit-logs` | `GET` | Returns immutable audit trail entries with SHA-256 block representation. |

---

## 5. Quick-Start & Verification Instructions

### Prerequisites
- Node.js LTS (v18+)
- SQLite / PostgreSQL

### Running the Application
```bash
# 1. Install dependencies
npm install

# 2. Synchronize database and run seed
npx prisma db push
npx tsx prisma/seed.ts

# 3. Start production server
npm run build
npm run start
```
Access the application at **`http://localhost:3000`**.

---

## 6. Demonstration & Evaluation Guide

1. **National Overview (`/`)**: Review national pendency across all 8 regions, summary metrics (`128`, `34`, `12`, `7`), and the priority applications table.
2. **Fast-Forward Simulation**: Click `Simulate Cron (+7d)` in the top header to demonstrate automatic SLA breach detection, document expiry surveillance, and automated Level-2 HQ escalation.
3. **Role Login Portal (`/login`)**: Switch roles seamlessly between Regulation Bureau Admin, Regional Officer, Scrutiny Chair, EVC Inspector, and Institute PID Holder.
4. **Split-Screen Scrutiny**: Inspect Land Lease Deeds, click `Verify Document`, or click `Revert for Re-Scrutiny with Deficiency Tag` to reset turnaround to 4 days.
5. **Geotagged EVC Reporting**: In `EVC Scheduling`, click `Submit Report`, capture site GPS coordinates, and submit recommendation.
6. **Affidavit-2 Compliance**: In `Compliance`, review statutory expiry alerts and upload proof for pending undertakings.
7. **Immutable Audit Trail**: In `Audit Trail`, inspect the cryptographic chronological ledger with SHA-256 entry hashes and actor tags.
8. **System Guide**: Accessible anytime via the sidebar tab or at `http://localhost:3000/readme`.
