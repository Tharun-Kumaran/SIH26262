export type Role =
  | 'REGULATION_BUREAU_ADMIN'
  | 'RO_OFFICER'
  | 'SCRUTINY_COMMITTEE'
  | 'EVC_EXPERT'
  | 'SHC_SAC_COMMITTEE'
  | 'INSTITUTE_USER';

export type AICTERegion =
  | 'NWRO'
  | 'NRO'
  | 'WRO'
  | 'CRO'
  | 'ERO'
  | 'SCRO'
  | 'SRO'
  | 'SWRO'
  | 'HQ';

export const REGION_DETAILS: Record<string, { name: string; hq: string }> = {
  NWRO: { name: 'North-Western Regional Office', hq: 'Chandigarh' },
  NRO: { name: 'Northern Regional Office', hq: 'Kanpur' },
  WRO: { name: 'Western Regional Office', hq: 'Mumbai' },
  CRO: { name: 'Central Regional Office', hq: 'Bhopal' },
  ERO: { name: 'Eastern Regional Office', hq: 'Kolkata' },
  SCRO: { name: 'South-Central Regional Office', hq: 'Hyderabad' },
  SRO: { name: 'Southern Regional Office', hq: 'Chennai' },
  SWRO: { name: 'South-Western Regional Office', hq: 'Bengaluru' },
  HQ: { name: 'AICTE Headquarters', hq: 'New Delhi' },
};

export const APH_TRACKS = {
  NEW_INSTITUTE: 'Chapter I - New Technical Institution (LoA)',
  EOA_STANDARD: 'Chapter II - Extension of Approval (Standard Self-Disclosure)',
  EOA_3YEAR_MERIT: 'APH 2024-27 - 3-Year EoA Merit Track (NIRF/NBA/NAAC)',
  INFRA_MODIFICATION: 'Chapter III - Infrastructure Modification / Conversion',
};

export const STAGE_LABELS: Record<string, string> = {
  SUBMITTED: 'Application Submitted',
  SCRUTINY: 'Document Scrutiny',
  RE_SCRUTINY: 'Re-Scrutiny (Deficiency Rectification)',
  AUTOMATED_ELIGIBILITY_CHECK: 'Automated Merit Verification',
  EVC_SCHEDULED: 'Expert Visit Committee (EVC) Scheduled',
  EVC_COMPLETED: 'EVC Inspection Completed',
  SHC_HEARING: 'Standing Hearing Committee (SHC)',
  SAC_APPEAL: 'Standing Appellate Committee (SAC)',
  APPROVED: 'Approved',
  REJECTED: 'Application Rejected',
  EOA_GRANTED: 'Extension of Approval Granted',
  EOA_3YEAR_GRANTED: '3-Year EoA Granted (Merit)',
  LOA_GRANTED: 'Letter of Approval (LoA) Granted',
};

export const DOCUMENT_CATEGORIES: Record<string, string> = {
  LEASE_DEED: 'Registered Land Lease Deed / Ownership',
  FIRE_SAFETY_NOC: 'Fire Safety Certificate / NOC',
  STRUCTURAL_STABILITY: 'Building Structural Stability & Occupancy',
  BANK_FDR: 'Bank FDR / Joint AICTE Fixed Deposit',
  AFFIDAVIT_2: 'Affidavit-2 (Time-bound Undertaking)',
  OCCUPANCY_CERT: 'Municipal Occupancy Certificate',
};
