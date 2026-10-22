'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, LogIn } from 'lucide-react';
import { ReadmeView } from '@/components/ReadmeView';

export default function StandaloneReadmePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#172B4D] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-[52px] bg-white border-b border-[#DDE1E5] px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#172B4D] border border-[#DDE1E5] text-[12px] font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-[#DDE1E5]">
            <div className="w-7 h-7 rounded bg-[#1D3B63] border border-[#2B5488] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="leading-tight">
              <span className="text-[13px] font-semibold text-[#172B4D]">
                AICTE Regulatory Control Tower
              </span>
              <span className="text-[#8993A4] text-[12px] ml-2 hidden sm:inline">
                System Guide & Technical Specifications (README)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#245A91] hover:bg-[#1B4570] text-white text-[12px] font-medium transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Role Sign-In</span>
          </a>
          <span className="text-[11px] font-mono text-[#5E6C84] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#DDE1E5]">
            PS 26262
          </span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-6">
        <ReadmeView />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DDE1E5] bg-white py-3 px-6 text-center text-[11px] text-[#5E6C84] font-mono">
        All India Council for Technical Education • Regulation Bureau • Approval Process Handbook (APH 2024-27)
      </footer>
    </div>
  );
}
