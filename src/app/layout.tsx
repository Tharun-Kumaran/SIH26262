import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AICTE Regulatory Control Tower | Approval Operations',
  description:
    'Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System (Problem Statement 26262).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F6F7] text-[#172B4D] antialiased">
        {children}
      </body>
    </html>
  );
}
