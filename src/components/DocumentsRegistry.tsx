'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import { DOCUMENT_CATEGORIES } from '@/lib/types';

import { Role } from '@/lib/types';

interface DocumentsRegistryProps {
  applications: any[];
  currentRole?: Role;
}

export const DocumentsRegistry: React.FC<DocumentsRegistryProps> = ({
  applications,
  currentRole = 'REGULATION_BUREAU_ADMIN',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract all documents across all applications (or scoped strictly to institute PID)
  const scopedApps =
    currentRole === 'INSTITUTE_USER'
      ? applications.filter((app) => app.institution?.aictePid === '1-1029384751')
      : applications;

  const allDocs = scopedApps.flatMap((app) =>
    (app.documents || []).map((doc: any) => ({
      ...doc,
      institutionName: app.institution?.name,
      institutionPid: app.institution?.aictePid,
      region: app.institution?.region,
      appNo: app.applicationNo,
    }))
  );

  const filteredDocs = allDocs.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'ALL' || doc.verificationStatus === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      doc.documentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.institutionName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.institutionPid?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4 max-w-[1216px] mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D] tracking-tight">
            {currentRole === 'INSTITUTE_USER'
              ? 'My Institution Statutory Documents'
              : 'Statutory Documents Registry'}
          </h1>
          <p className="text-[13px] text-[#5E6C84] mt-0.5">
            {currentRole === 'INSTITUTE_USER'
              ? 'Archival and validity surveillance for Madras Institute of Technology (PID: 1-1029384751)'
              : 'Archival and compliance surveillance of Lease Deeds, Fire NOCs, Structural Stability and Bank FDRs'}
          </p>
        </div>
        <span className="text-[12px] font-medium text-[#5E6C84] bg-white border border-[#DDE1E5] px-2.5 py-1 rounded">
          {filteredDocs.length} Total Documents
        </span>
      </div>

      {/* Filter Controls */}
      <div className="enterprise-panel p-3 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8993A4]" />
            <input
              type="text"
              placeholder="Search document title, ref no, or institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91]"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91] pr-7 cursor-pointer appearance-none"
            >
              <option value="ALL">All Categories</option>
              <option value="LEASE_DEED">Registered Land Lease Deed</option>
              <option value="FIRE_SAFETY_NOC">Fire Safety NOC</option>
              <option value="STRUCTURAL_STABILITY">Structural Stability Certificate</option>
              <option value="BANK_FDR">Bank Fixed Deposit Receipt</option>
              <option value="AFFIDAVIT_2">Affidavit-2 Undertaking</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#5E6C84] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1 text-[12px] bg-white border border-[#DDE1E5] rounded text-[#172B4D] focus:outline-none focus:border-[#245A91] pr-7 cursor-pointer appearance-none"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="DEFICIENT">Deficient</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#5E6C84] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Document Records Table */}
      <div className="enterprise-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="py-2.5 px-3.5 font-semibold">Document Category</th>
                <th className="py-2.5 px-3.5 font-semibold">Document Title & Ref</th>
                <th className="py-2.5 px-3.5 font-semibold">Institution Name</th>
                <th className="py-2.5 px-3.5 font-semibold">Region</th>
                <th className="py-2.5 px-3.5 font-semibold">Statutory Expiry</th>
                <th className="py-2.5 px-3.5 font-semibold">Status</th>
                <th className="py-2.5 px-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F4] text-[12px]">
              {filteredDocs.map((doc: any) => {
                const isExpired = doc.verificationStatus === 'EXPIRED';
                const isVerified = doc.verificationStatus === 'VERIFIED';
                const isDeficient = doc.verificationStatus === 'DEFICIENT';

                return (
                  <tr key={doc.id} className="table-row">
                    <td className="py-2.5 px-3.5 font-medium text-[#172B4D]">
                      {DOCUMENT_CATEGORIES[doc.category] || doc.category}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="text-[#172B4D] font-medium">{doc.documentTitle}</div>
                      <div className="text-[11px] font-mono text-[#5E6C84]">
                        Ref: {doc.documentNumber || 'Pending endorsement'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="text-[#172B4D]">{doc.institutionName}</div>
                      <div className="text-[11px] text-[#5E6C84] font-mono">PID: {doc.institutionPid}</div>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-[#5E6C84]">
                      {doc.region}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {doc.expiryDate ? (
                        <span
                          className={
                            doc.isExpiringSoon || isExpired
                              ? 'text-[#DC2626] font-medium'
                              : 'text-[#5E6C84]'
                          }
                        >
                          {new Date(doc.expiryDate).toLocaleDateString()}
                          {doc.isExpiringSoon && ' (Expiring Soon)'}
                        </span>
                      ) : (
                        <span className="text-[#8993A4]">Perpetual</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                          isVerified
                            ? 'bg-[#EFF8F3] text-[#1E7E45] border border-[#BDE3CF]'
                            : isDeficient
                            ? 'bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2]'
                            : isExpired
                            ? 'bg-[#FEECEB] text-[#DC2626] border border-[#FBC5C2]'
                            : 'bg-[#FEF6E7] text-[#9A6208] border border-[#FDE6B8]'
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <a
                        href={doc.fileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-white hover:bg-[#F4F5F7] border border-[#DDE1E5] text-[11px] text-[#245A91] font-medium inline-flex items-center gap-1"
                      >
                        <span>PDF</span>
                        <ExternalLink className="w-3 h-3 text-[#5E6C84]" />
                      </a>
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
