import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning previous data ---');
  await prisma.auditLog.deleteMany();
  await prisma.eVCSchedule.deleteMany();
  await prisma.undertaking.deleteMany();
  await prisma.document.deleteMany();
  await prisma.application.deleteMany();
  await prisma.workflowRule.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  console.log('--- Seeding Workflow Rules ---');
  const rules = [
    // NEW_INSTITUTE Track Rules
    {
      aphTrack: 'NEW_INSTITUTE',
      stage: 'SUBMITTED',
      slaDays: 3,
      allowedTransitions: JSON.stringify(['SCRUTINY']),
      requiresApprovalBy: 'RO_OFFICER',
    },
    {
      aphTrack: 'NEW_INSTITUTE',
      stage: 'SCRUTINY',
      slaDays: 5,
      allowedTransitions: JSON.stringify(['RE_SCRUTINY', 'EVC_SCHEDULED', 'REJECTED']),
      requiresApprovalBy: 'SCRUTINY_COMMITTEE',
    },
    {
      aphTrack: 'NEW_INSTITUTE',
      stage: 'RE_SCRUTINY',
      slaDays: 4,
      allowedTransitions: JSON.stringify(['EVC_SCHEDULED', 'REJECTED']),
      requiresApprovalBy: 'SCRUTINY_COMMITTEE',
    },
    {
      aphTrack: 'NEW_INSTITUTE',
      stage: 'EVC_SCHEDULED',
      slaDays: 7,
      allowedTransitions: JSON.stringify(['EVC_COMPLETED', 'SHC_HEARING']),
      requiresApprovalBy: 'EVC_EXPERT',
    },
    {
      aphTrack: 'NEW_INSTITUTE',
      stage: 'EVC_COMPLETED',
      slaDays: 3,
      allowedTransitions: JSON.stringify(['SHC_HEARING', 'LOA_GRANTED', 'REJECTED']),
      requiresApprovalBy: 'RO_OFFICER',
    },
    {
      aphTrack: 'NEW_INSTITUTE',
      stage: 'SHC_HEARING',
      slaDays: 7,
      allowedTransitions: JSON.stringify(['SAC_APPEAL', 'LOA_GRANTED', 'REJECTED']),
      requiresApprovalBy: 'SHC_SAC_COMMITTEE',
    },
    {
      aphTrack: 'NEW_INSTITUTE',
      stage: 'SAC_APPEAL',
      slaDays: 5,
      allowedTransitions: JSON.stringify(['LOA_GRANTED', 'REJECTED']),
      requiresApprovalBy: 'REGULATION_BUREAU_ADMIN',
    },

    // EOA_STANDARD Track Rules
    {
      aphTrack: 'EOA_STANDARD',
      stage: 'SUBMITTED',
      slaDays: 3,
      allowedTransitions: JSON.stringify(['SCRUTINY']),
      requiresApprovalBy: 'RO_OFFICER',
    },
    {
      aphTrack: 'EOA_STANDARD',
      stage: 'SCRUTINY',
      slaDays: 5,
      allowedTransitions: JSON.stringify(['EOA_GRANTED', 'EVC_SCHEDULED', 'RE_SCRUTINY']),
      requiresApprovalBy: 'SCRUTINY_COMMITTEE',
    },
    {
      aphTrack: 'EOA_STANDARD',
      stage: 'RE_SCRUTINY',
      slaDays: 4,
      allowedTransitions: JSON.stringify(['EOA_GRANTED', 'EVC_SCHEDULED', 'REJECTED']),
      requiresApprovalBy: 'SCRUTINY_COMMITTEE',
    },
    {
      aphTrack: 'EOA_STANDARD',
      stage: 'EVC_SCHEDULED',
      slaDays: 7,
      allowedTransitions: JSON.stringify(['EVC_COMPLETED', 'SHC_HEARING']),
      requiresApprovalBy: 'EVC_EXPERT',
    },
    {
      aphTrack: 'EOA_STANDARD',
      stage: 'EVC_COMPLETED',
      slaDays: 3,
      allowedTransitions: JSON.stringify(['EOA_GRANTED', 'SHC_HEARING', 'REJECTED']),
      requiresApprovalBy: 'RO_OFFICER',
    },
    {
      aphTrack: 'EOA_STANDARD',
      stage: 'SHC_HEARING',
      slaDays: 7,
      allowedTransitions: JSON.stringify(['EOA_GRANTED', 'REJECTED']),
      requiresApprovalBy: 'SHC_SAC_COMMITTEE',
    },

    // EOA_3YEAR_MERIT Track Rules
    {
      aphTrack: 'EOA_3YEAR_MERIT',
      stage: 'SUBMITTED',
      slaDays: 2,
      allowedTransitions: JSON.stringify(['AUTOMATED_ELIGIBILITY_CHECK']),
      requiresApprovalBy: 'RO_OFFICER',
    },
    {
      aphTrack: 'EOA_3YEAR_MERIT',
      stage: 'AUTOMATED_ELIGIBILITY_CHECK',
      slaDays: 2,
      allowedTransitions: JSON.stringify(['EOA_3YEAR_GRANTED', 'SCRUTINY']),
      requiresApprovalBy: 'REGULATION_BUREAU_ADMIN',
    },

    // INFRA_MODIFICATION Track Rules
    {
      aphTrack: 'INFRA_MODIFICATION',
      stage: 'SUBMITTED',
      slaDays: 3,
      allowedTransitions: JSON.stringify(['EVC_SCHEDULED']),
      requiresApprovalBy: 'RO_OFFICER',
    },
    {
      aphTrack: 'INFRA_MODIFICATION',
      stage: 'EVC_SCHEDULED',
      slaDays: 7,
      allowedTransitions: JSON.stringify(['EVC_COMPLETED', 'SHC_HEARING']),
      requiresApprovalBy: 'EVC_EXPERT',
    },
    {
      aphTrack: 'INFRA_MODIFICATION',
      stage: 'EVC_COMPLETED',
      slaDays: 3,
      allowedTransitions: JSON.stringify(['APPROVED', 'SHC_HEARING', 'REJECTED']),
      requiresApprovalBy: 'RO_OFFICER',
    },
    {
      aphTrack: 'INFRA_MODIFICATION',
      stage: 'SHC_HEARING',
      slaDays: 7,
      allowedTransitions: JSON.stringify(['APPROVED', 'REJECTED']),
      requiresApprovalBy: 'SHC_SAC_COMMITTEE',
    },
  ];

  for (const r of rules) {
    await prisma.workflowRule.create({ data: r });
  }

  console.log('--- Seeding 8 Regional AICTE Institutions ---');
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
  const daysAhead = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

  const institutionsData = [
    {
      aictePid: '1-1029384751',
      name: 'Madras Institute of Engineering & Technology',
      region: 'SRO',
      state: 'Tamil Nadu',
      city: 'Chennai',
      address: 'Sardar Patel Road, Guindy, Chennai - 600025',
      institutionType: 'ENGINEERING',
      nirfRank: 42,
      nbaAccredited: true,
      naacGrade: 'A++',
      contactEmail: 'principal@miet-chennai.edu.in',
      contactPhone: '+91-44-22357004',
    },
    {
      aictePid: '1-2094857163',
      name: 'Bombay Advanced Polytechnic & Technology Institute',
      region: 'WRO',
      state: 'Maharashtra',
      city: 'Mumbai',
      address: 'V.N. Purav Marg, Deonar, Mumbai - 400088',
      institutionType: 'POLYTECHNIC',
      nirfRank: null,
      nbaAccredited: false,
      naacGrade: 'B++',
      contactEmail: 'director@bapti-mumbai.ac.in',
      contactPhone: '+91-22-25563120',
    },
    {
      aictePid: '1-3847291054',
      name: 'Kanpur Institute of Technology & Management',
      region: 'NRO',
      state: 'Uttar Pradesh',
      city: 'Kanpur',
      address: 'A-1 UPSIDC Industrial Area, Rooma, Kanpur - 208001',
      institutionType: 'MANAGEMENT',
      nirfRank: 89,
      nbaAccredited: true,
      naacGrade: 'A',
      contactEmail: 'registrar@kitm-kanpur.edu.in',
      contactPhone: '+91-512-2415002',
    },
    {
      aictePid: '1-4920183756',
      name: 'Chandigarh Institute of Artificial Intelligence & Robotics',
      region: 'NWRO',
      state: 'Punjab',
      city: 'Chandigarh',
      address: 'Sector 26, Madhya Marg, Chandigarh - 160019',
      institutionType: 'ENGINEERING',
      nirfRank: 31,
      nbaAccredited: true,
      naacGrade: 'A+',
      contactEmail: 'head@ciair-chd.gov.in',
      contactPhone: '+91-172-2790112',
    },
    {
      aictePid: '1-5839201742',
      name: 'Bhopal Central Institute of Pharmacy & BioSciences',
      region: 'CRO',
      state: 'Madhya Pradesh',
      city: 'Bhopal',
      address: 'Bhadbhada Road, Suraj Nagar, Bhopal - 462044',
      institutionType: 'PHARMACY',
      nirfRank: 64,
      nbaAccredited: false,
      naacGrade: 'B',
      contactEmail: 'info@bcip-bhopal.edu.in',
      contactPhone: '+91-755-2696001',
    },
    {
      aictePid: '1-6748291035',
      name: 'Kolkata Heritage Institute of Architecture & Planning',
      region: 'ERO',
      state: 'West Bengal',
      city: 'Kolkata',
      address: '994 Chowbaga Road, Anandapur, Kolkata - 700107',
      institutionType: 'ARCHITECTURE',
      nirfRank: 55,
      nbaAccredited: false,
      naacGrade: 'A',
      contactEmail: 'admin@khiap-kolkata.org',
      contactPhone: '+91-33-24430456',
    },
    {
      aictePid: '1-7892013845',
      name: 'Hyderabad Cyber Valley Institute of Technology',
      region: 'SCRO',
      state: 'Telangana',
      city: 'Hyderabad',
      address: 'HITEC City, Madhapur, Hyderabad - 500081',
      institutionType: 'ENGINEERING',
      nirfRank: 28,
      nbaAccredited: true,
      naacGrade: 'A++',
      contactEmail: 'deans@hcvit-hyderabad.ac.in',
      contactPhone: '+91-40-66778899',
    },
    {
      aictePid: '1-8930192847',
      name: 'Bengaluru Silicon Valley Institute of Applied Sciences',
      region: 'SWRO',
      state: 'Karnataka',
      city: 'Bengaluru',
      address: 'Outer Ring Road, Marathahalli, Bengaluru - 560037',
      institutionType: 'ENGINEERING',
      nirfRank: 19,
      nbaAccredited: true,
      naacGrade: 'A++',
      contactEmail: 'principal@bsvias-blr.edu.in',
      contactPhone: '+91-80-41223344',
    },
  ];

  const createdInstitutions = [];
  for (const inst of institutionsData) {
    const created = await prisma.institution.create({ data: inst });
    createdInstitutions.push(created);
  }

  console.log('--- Seeding RBAC Demo Users ---');
  const demoUsers = [
    {
      email: 'hq.admin@aicte-india.org',
      name: 'Dr. Mamidala Jagadesh Kumar (HQ Admin)',
      role: 'REGULATION_BUREAU_ADMIN',
      region: 'HQ',
    },
    {
      email: 'ro.sro@aicte-india.org',
      name: 'Dr. K. Sundararajan (Regional Officer SRO)',
      role: 'RO_OFFICER',
      region: 'SRO',
    },
    {
      email: 'ro.wro@aicte-india.org',
      name: 'Er. Rajesh Deshmukh (Regional Officer WRO)',
      role: 'RO_OFFICER',
      region: 'WRO',
    },
    {
      email: 'scrutiny.chair@aicte-india.org',
      name: 'Prof. Ananya Sen (Scrutiny Committee Chair)',
      role: 'SCRUTINY_COMMITTEE',
      region: 'SRO',
    },
    {
      email: 'evc.expert@aicte-india.org',
      name: 'Prof. Vikram Malhotra (EVC Expert Inspector)',
      role: 'EVC_EXPERT',
      region: 'WRO',
    },
    {
      email: 'shc.member@aicte-india.org',
      name: 'Justice (Retd.) S. K. Verma (SHC Hearing Chair)',
      role: 'SHC_SAC_COMMITTEE',
      region: 'HQ',
    },
    {
      email: 'principal@miet-chennai.edu.in',
      name: 'Dr. R. Ramanathan (PID: 1-1029384751)',
      role: 'INSTITUTE_USER',
      region: 'SRO',
      institutionId: createdInstitutions[0].id,
    },
  ];

  for (const u of demoUsers) {
    await prisma.user.create({ data: u });
  }

  console.log('--- Seeding Applications stuck in various APH Stages & SLA States ---');
  // 1. App 1: SRO - Madras Institute - SCRUTINY (Approaching SLA breach, T-1 day left)
  const app1 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-849201',
      institutionId: createdInstitutions[0].id,
      academicYear: '2026-27',
      aphTrack: 'NEW_INSTITUTE',
      currentStage: 'SCRUTINY',
      previousStage: 'SUBMITTED',
      terFeeStatus: 'PAID',
      terFeeAmount: 200000,
      terPaymentRef: 'SBIPAY-2026-981240',
      submittedAt: daysAgo(4),
      stageStartedAt: daysAgo(4),
      slaDeadline: daysAhead(1), // 1 day remaining!
      slaDaysAllocated: 5,
      isOverdue: false,
      ageingDays: 4,
      deficiencyCount: 1,
      escalationLevel: 0,
      assignedOfficer: 'Dr. K. Sundararajan',
      scrutinyRemark: 'Structural stability certificate missing registered structural engineer stamp.',
    },
  });

  // 2. App 2: WRO - Bombay Poly - RE_SCRUTINY (Overdue SLA breach, escalated)
  const app2 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-392014',
      institutionId: createdInstitutions[1].id,
      academicYear: '2026-27',
      aphTrack: 'EOA_STANDARD',
      currentStage: 'RE_SCRUTINY',
      previousStage: 'SCRUTINY',
      terFeeStatus: 'PAID',
      terFeeAmount: 150000,
      terPaymentRef: 'HDFCPAY-2026-112344',
      submittedAt: daysAgo(12),
      stageStartedAt: daysAgo(7),
      slaDeadline: daysAgo(3), // 3 days OVERDUE!
      slaDaysAllocated: 4,
      isOverdue: true,
      ageingDays: 12,
      deficiencyCount: 3,
      escalationLevel: 2, // Escalated to HQ
      assignedOfficer: 'Er. Rajesh Deshmukh',
      scrutinyRemark: 'Fire Safety NOC has expired and Land lease deed is expiring within 15 days.',
    },
  });

  // 3. App 3: NRO - Kanpur - EVC_SCHEDULED (Inspection due tomorrow, Virtual mode)
  const app3 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-592810',
      institutionId: createdInstitutions[2].id,
      academicYear: '2026-27',
      aphTrack: 'NEW_INSTITUTE',
      currentStage: 'EVC_SCHEDULED',
      previousStage: 'SCRUTINY',
      terFeeStatus: 'PAID',
      terFeeAmount: 250000,
      terPaymentRef: 'ICICIPAY-2026-443322',
      submittedAt: daysAgo(9),
      stageStartedAt: daysAgo(3),
      slaDeadline: daysAhead(4),
      slaDaysAllocated: 7,
      isOverdue: false,
      ageingDays: 9,
      deficiencyCount: 0,
      escalationLevel: 0,
      assignedOfficer: 'Dr. Alok Srivastava',
    },
  });

  // 4. App 4: NWRO - Chandigarh - SHC_HEARING (Hearing for Land conversion breach)
  const app4 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-781923',
      institutionId: createdInstitutions[3].id,
      academicYear: '2026-27',
      aphTrack: 'INFRA_MODIFICATION',
      currentStage: 'SHC_HEARING',
      previousStage: 'EVC_COMPLETED',
      terFeeStatus: 'PAID',
      terFeeAmount: 300000,
      terPaymentRef: 'PNBPAY-2026-778899',
      submittedAt: daysAgo(18),
      stageStartedAt: daysAgo(8),
      slaDeadline: daysAgo(1), // 1 day overdue for hearing verdict
      slaDaysAllocated: 7,
      isOverdue: true,
      ageingDays: 18,
      deficiencyCount: 2,
      escalationLevel: 1, // Warning
      assignedOfficer: 'Er. Gurpreet Singh',
      scrutinyRemark: 'EVC noted deficit of 420 sqm carpet area in Computer Centre.',
    },
  });

  // 5. App 5: CRO - Bhopal - SCRUTINY (Overdue by 5 days)
  const app5 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-120485',
      institutionId: createdInstitutions[4].id,
      academicYear: '2026-27',
      aphTrack: 'EOA_STANDARD',
      currentStage: 'SCRUTINY',
      previousStage: 'SUBMITTED',
      terFeeStatus: 'PAID',
      terFeeAmount: 150000,
      terPaymentRef: 'BOIPAY-2026-102938',
      submittedAt: daysAgo(11),
      stageStartedAt: daysAgo(10),
      slaDeadline: daysAgo(5), // 5 days overdue!
      slaDaysAllocated: 5,
      isOverdue: true,
      ageingDays: 11,
      deficiencyCount: 2,
      escalationLevel: 2, // Escalated to HQ
      assignedOfficer: 'Dr. Vivek Sharma',
      scrutinyRemark: 'Pending verification of Joint FDR with AICTE.',
    },
  });

  // 6. App 6: ERO - Kolkata - EVC_SCHEDULED (Physical Inspection)
  const app6 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-671049',
      institutionId: createdInstitutions[5].id,
      academicYear: '2026-27',
      aphTrack: 'INFRA_MODIFICATION',
      currentStage: 'EVC_SCHEDULED',
      previousStage: 'SUBMITTED',
      terFeeStatus: 'PAID',
      terFeeAmount: 200000,
      terPaymentRef: 'UBIPAY-2026-339922',
      submittedAt: daysAgo(6),
      stageStartedAt: daysAgo(2),
      slaDeadline: daysAhead(5),
      slaDaysAllocated: 7,
      isOverdue: false,
      ageingDays: 6,
      deficiencyCount: 0,
      escalationLevel: 0,
      assignedOfficer: 'Prof. Subhasish Das',
    },
  });

  // 7. App 7: SCRO - Hyderabad - EOA_3YEAR_MERIT (Eligible for instant approval)
  const app7 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-902814',
      institutionId: createdInstitutions[6].id,
      academicYear: '2026-27',
      aphTrack: 'EOA_3YEAR_MERIT',
      currentStage: 'AUTOMATED_ELIGIBILITY_CHECK',
      previousStage: 'SUBMITTED',
      terFeeStatus: 'PAID',
      terFeeAmount: 350000,
      terPaymentRef: 'SBIPAY-2026-887711',
      submittedAt: daysAgo(1),
      stageStartedAt: daysAgo(1),
      slaDeadline: daysAhead(1),
      slaDaysAllocated: 2,
      isOverdue: false,
      ageingDays: 1,
      deficiencyCount: 0,
      escalationLevel: 0,
      assignedOfficer: 'Dr. P. Venkatesh',
    },
  });

  // 8. App 8: SWRO - Bengaluru - LOA_GRANTED (Approved new institute)
  const app8 = await prisma.application.create({
    data: {
      applicationNo: 'AICTE/2026-27/APP-994821',
      institutionId: createdInstitutions[7].id,
      academicYear: '2026-27',
      aphTrack: 'NEW_INSTITUTE',
      currentStage: 'LOA_GRANTED',
      previousStage: 'EVC_COMPLETED',
      terFeeStatus: 'PAID',
      terFeeAmount: 250000,
      terPaymentRef: 'CANARAPAY-2026-992211',
      submittedAt: daysAgo(20),
      stageStartedAt: daysAgo(2),
      slaDeadline: daysAhead(5),
      slaDaysAllocated: 7,
      isOverdue: false,
      ageingDays: 20,
      deficiencyCount: 0,
      escalationLevel: 0,
      approvalDecision: 'APPROVED',
      assignedOfficer: 'Dr. Ramesh Babu',
      scrutinyRemark: 'All APH 2024-27 norms satisfied. EVC recommended unconditionally.',
    },
  });

  console.log('--- Seeding Documents (Lease Deed, Fire Safety NOC, FDR at T-15, T-5, Overdue) ---');
  // Documents for Madras Institute (App 1)
  await prisma.document.createMany({
    data: [
      {
        institutionId: createdInstitutions[0].id,
        applicationId: app1.id,
        category: 'LEASE_DEED',
        documentTitle: '30-Year Registered Land Lease Deed (Document No. 4920/1997)',
        documentNumber: 'TN-REG-4920-1997',
        fileUrl: 'https://docs.aicte-india.org/sro/chennai/lease_deed_1-1029384751.pdf',
        issueDate: daysAgo(10950), // 30 years ago
        expiryDate: daysAhead(15), // T-15 Days Expiring Soon!
        verificationStatus: 'VERIFIED',
        isExpiringSoon: true,
        verifiedBy: 'Dr. K. Sundararajan',
        verifiedAt: daysAgo(2),
      },
      {
        institutionId: createdInstitutions[0].id,
        applicationId: app1.id,
        category: 'FIRE_SAFETY_NOC',
        documentTitle: 'Tamil Nadu Fire & Rescue Services NOC (Annual Renewal)',
        documentNumber: 'TNFRS/NOC/2025/8892',
        fileUrl: 'https://docs.aicte-india.org/sro/chennai/fire_noc_2025.pdf',
        issueDate: daysAgo(360),
        expiryDate: daysAhead(5), // T-5 Days Critical Expiry!
        verificationStatus: 'PENDING',
        isExpiringSoon: true,
        deficiencyRemarks: 'Renewal application copy submitted, final certificate pending fire brigade re-inspection.',
      },
      {
        institutionId: createdInstitutions[0].id,
        applicationId: app1.id,
        category: 'STRUCTURAL_STABILITY',
        documentTitle: 'PWD / Chartered Structural Stability Certificate',
        documentNumber: 'PWD-STR-2024-1102',
        fileUrl: 'https://docs.aicte-india.org/sro/chennai/structural_cert.pdf',
        issueDate: daysAgo(600),
        expiryDate: daysAhead(1200),
        verificationStatus: 'DEFICIENT',
        deficiencyRemarks: 'Certificate missing structural engineer QR verification and PWD endorsement stamp.',
        verifiedBy: 'Prof. Ananya Sen',
        verifiedAt: daysAgo(3),
      },
      {
        institutionId: createdInstitutions[0].id,
        applicationId: app1.id,
        category: 'BANK_FDR',
        documentTitle: 'Joint FDR with Regional Officer AICTE (₹1.50 Crore)',
        documentNumber: 'FDR/SBI/GUINDY/908129',
        fileUrl: 'https://docs.aicte-india.org/sro/chennai/fdr_receipt.pdf',
        issueDate: daysAgo(700),
        expiryDate: daysAhead(1125),
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. K. Sundararajan',
        verifiedAt: daysAgo(2),
      },
    ],
  });

  // Documents for Bombay Poly (App 2) - Overdue Expiries!
  await prisma.document.createMany({
    data: [
      {
        institutionId: createdInstitutions[1].id,
        applicationId: app2.id,
        category: 'FIRE_SAFETY_NOC',
        documentTitle: 'Mumbai Municipal Fire Brigade Safety Clearance',
        documentNumber: 'MCGM-FB-2024-5512',
        fileUrl: 'https://docs.aicte-india.org/wro/mumbai/fire_noc_expired.pdf',
        issueDate: daysAgo(380),
        expiryDate: daysAgo(15), // OVERDUE / EXPIRED!
        verificationStatus: 'EXPIRED',
        isExpiringSoon: true,
        deficiencyRemarks: 'NOC expired on 07-Oct-2026. Non-compliant with APH Chapter II Section 2.4.',
        verifiedBy: 'Er. Rajesh Deshmukh',
        verifiedAt: daysAgo(5),
      },
      {
        institutionId: createdInstitutions[1].id,
        applicationId: app2.id,
        category: 'LEASE_DEED',
        documentTitle: 'MIDC Land Allotment & Registered Lease Agreement',
        documentNumber: 'MIDC/LEASE/1996/331',
        fileUrl: 'https://docs.aicte-india.org/wro/mumbai/lease_midc.pdf',
        issueDate: daysAgo(10900),
        expiryDate: daysAhead(12), // T-12 Days!
        verificationStatus: 'DEFICIENT',
        isExpiringSoon: true,
        deficiencyRemarks: 'Renewal lease deed extension from Maharashtra Revenue Department not submitted.',
        verifiedBy: 'Er. Rajesh Deshmukh',
        verifiedAt: daysAgo(5),
      },
    ],
  });

  // Documents for Bhopal Pharmacy (App 5) - FDR Expired
  await prisma.document.createMany({
    data: [
      {
        institutionId: createdInstitutions[4].id,
        applicationId: app5.id,
        category: 'BANK_FDR',
        documentTitle: 'Bank Fixed Deposit Receipt for AICTE Corpus',
        documentNumber: 'BOI/FDR/BHOPAL/441029',
        fileUrl: 'https://docs.aicte-india.org/cro/bhopal/fdr_boi.pdf',
        issueDate: daysAgo(1825),
        expiryDate: daysAgo(5), // EXPIRED!
        verificationStatus: 'EXPIRED',
        isExpiringSoon: true,
        deficiencyRemarks: 'Maturity reached without automatic renewal endorsement from Bank of India.',
        verifiedBy: 'Dr. Vivek Sharma',
        verifiedAt: daysAgo(8),
      },
    ],
  });

  console.log('--- Seeding Time-Bound Undertakings (Affidavit-2 at T-15, T-5, Overdue) ---');
  // Undertaking 1: T-5 Days approaching deadline
  await prisma.undertaking.create({
    data: {
      institutionId: createdInstitutions[0].id,
      applicationId: app1.id,
      title: 'Affidavit-2: Faculty Cadre Ratio Rectification',
      condition: 'Appointment of 3 Regular Professors and 5 Associate Professors as per 1:2:6 cadre ratio before Nov 2026.',
      aphClause: 'APH 2024-27 Clause 4.3(b)',
      dueDate: daysAhead(5), // T-5 Days approaching!
      fulfilmentStatus: 'PENDING',
      escalationLevel: 1, // Warning issued
      remarks: 'Interview call letters dispatched; final selection board minutes pending upload.',
    },
  });

  // Undertaking 2: OVERDUE Undertaking (Breached)
  await prisma.undertaking.create({
    data: {
      institutionId: createdInstitutions[1].id,
      applicationId: app2.id,
      title: 'Affidavit-2: Barrier-Free Built Environment & Lift Installation',
      condition: 'Commissioning of wheelchair ramps, tactile paths, and passenger lift in Block-B for Divyangjan.',
      aphClause: 'APH 2024-27 Clause 5.1(a) Divyangjan Compliance',
      dueDate: daysAgo(10), // 10 days OVERDUE!
      fulfilmentStatus: 'OVERDUE',
      escalationLevel: 2, // Show cause notice / HQ escalated
      remarks: 'Overdue by 10 days. Show Cause Notice generated automatically by AICTE Alert Engine.',
    },
  });

  // Undertaking 3: T-15 Days approaching
  await prisma.undertaking.create({
    data: {
      institutionId: createdInstitutions[3].id,
      applicationId: app4.id,
      title: 'Affidavit-2: High-Performance Computing Laboratory Upgradation',
      condition: 'Procurement of 60 GPU workstations and licensed EDA simulation software tools.',
      aphClause: 'APH 2024-27 Clause 6.2 Equipment Norms',
      dueDate: daysAhead(15), // T-15 Days!
      fulfilmentStatus: 'PENDING',
      escalationLevel: 0,
      remarks: 'PO issued to OEM, delivery expected within 10 days.',
    },
  });

  console.log('--- Seeding EVC Schedules (Physical & Virtual with GPS coordinates) ---');
  // EVC 1: Kanpur Institute (Scheduled tomorrow, Virtual mode)
  await prisma.eVCSchedule.create({
    data: {
      applicationId: app3.id,
      inspectionDate: daysAhead(1),
      mode: 'VIRTUAL',
      leadExpertName: 'Prof. Vikram Malhotra (IIT Roorkee)',
      expertPhone: '+91-9876543210',
      expertEmail: 'vikram.m@iitr.ac.in',
      status: 'SCHEDULED',
      gpsCoordinates: '26.4499,80.3319', // Kanpur GPS
      locationAddress: 'A-1 UPSIDC Industrial Area, Rooma, Kanpur - 208001',
      inspectionSummary: 'Scheduled virtual inspection using 360-degree pan-tilt-zoom camera feeds and live geo-fencing check.',
    },
  });

  // EVC 2: Kolkata Heritage Institute (Physical Inspection)
  await prisma.eVCSchedule.create({
    data: {
      applicationId: app6.id,
      inspectionDate: daysAhead(3),
      mode: 'PHYSICAL',
      leadExpertName: 'Prof. Debabrata Roy (Jadavpur University)',
      expertPhone: '+91-9830112233',
      expertEmail: 'droy@jadavpuruniversity.in',
      status: 'SCHEDULED',
      gpsCoordinates: '22.5186,88.4042', // Kolkata GPS
      locationAddress: '994 Chowbaga Road, Anandapur, Kolkata - 700107',
      inspectionSummary: 'Physical verification of newly constructed studio floors and workshop machinery.',
    },
  });

  // EVC 3: Bengaluru Institute (Completed EVC)
  await prisma.eVCSchedule.create({
    data: {
      applicationId: app8.id,
      inspectionDate: daysAgo(5),
      mode: 'PHYSICAL',
      leadExpertName: 'Prof. C. S. Ramachandra (IISc Bengaluru)',
      expertPhone: '+91-9448123456',
      expertEmail: 'csrama@iisc.ac.in',
      status: 'COMPLETED',
      gpsCoordinates: '12.9569,77.7011', // Bengaluru GPS
      locationAddress: 'Outer Ring Road, Marathahalli, Bengaluru - 560037',
      reportUrl: 'https://docs.aicte-india.org/swro/evc/report_app994821.pdf',
      inspectionSummary: '100% compliance observed. All labs, classrooms, barrier-free access, and fire hydrants verified on-site.',
      isRecommended: true,
      completedAt: daysAgo(4),
    },
  });

  console.log('--- Seeding Immutable Audit Logs ---');
  await prisma.auditLog.createMany({
    data: [
      {
        applicationId: app1.id,
        action: 'STAGE_TRANSITION',
        stageFrom: 'SUBMITTED',
        stageTo: 'SCRUTINY',
        actorRole: 'RO_OFFICER',
        actorName: 'Dr. K. Sundararajan',
        details: 'Application cleared initial TER payment verification (₹2,00,000) and assigned to Scrutiny Committee SRO.',
        timestamp: daysAgo(4),
      },
      {
        applicationId: app1.id,
        action: 'DEFICIENCY_MARKED',
        stageFrom: 'SCRUTINY',
        stageTo: 'SCRUTINY',
        actorRole: 'SCRUTINY_COMMITTEE',
        actorName: 'Prof. Ananya Sen',
        details: 'Structural stability certificate flagged: Missing official PWD endorsement seal.',
        timestamp: daysAgo(3),
      },
      {
        applicationId: app2.id,
        action: 'SLA_BREACH_DETECTED',
        stageFrom: 'RE_SCRUTINY',
        stageTo: 'RE_SCRUTINY',
        actorRole: 'SYSTEM_CRON',
        actorName: 'AICTE SLA Monitoring Engine',
        details: 'Application exceeded 4-day SLA in RE_SCRUTINY stage by 3 days. System auto-incremented ageing days to 12.',
        timestamp: daysAgo(3),
      },
      {
        applicationId: app2.id,
        action: 'ESCALATED_TO_HQ',
        stageFrom: 'RE_SCRUTINY',
        stageTo: 'RE_SCRUTINY',
        actorRole: 'SYSTEM_CRON',
        actorName: 'AICTE Escalation Engine',
        details: 'Overdue application auto-escalated to REGULATION_BUREAU_ADMIN with Level 2 priority tag.',
        timestamp: daysAgo(2),
      },
      {
        applicationId: app4.id,
        action: 'STAGE_TRANSITION',
        stageFrom: 'EVC_COMPLETED',
        stageTo: 'SHC_HEARING',
        actorRole: 'RO_OFFICER',
        actorName: 'Er. Gurpreet Singh',
        details: 'Referred to Standing Hearing Committee (SHC) due to carpet area discrepancy observed during EVC inspection.',
        timestamp: daysAgo(8),
      },
      {
        applicationId: app8.id,
        action: 'STAGE_TRANSITION',
        stageFrom: 'EVC_COMPLETED',
        stageTo: 'LOA_GRANTED',
        actorRole: 'REGULATION_BUREAU_ADMIN',
        actorName: 'Dr. Mamidala Jagadesh Kumar',
        details: 'Letter of Approval (LoA) granted for Academic Year 2026-27 following flawless EVC inspection recommendation.',
        timestamp: daysAgo(2),
      },
    ],
  });

  console.log('--- Seed completed successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
