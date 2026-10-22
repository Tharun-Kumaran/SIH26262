'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Sliders,
  TrendingUp,
  MapPin,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { STAGE_LABELS, APH_TRACKS, REGION_DETAILS } from '@/lib/types';

interface HQDashboardProps {
  applications: any[];
  rules: any[];
  onRefresh: () => void;
  onOpenAuditLogs: () => void;
  onSelectApplicationForScrutiny: (app: any) => void;
}

export const HQDashboard: React.FC<HQDashboardProps> = ({
  applications,
  rules,
  onRefresh,
  onOpenAuditLogs,
  onSelectApplicationForScrutiny,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editSlaDays, setEditSlaDays] = useState<number>(7);
  const [isUpdatingRule, setIsUpdatingRule] = useState<boolean>(false);
  const [ruleMessage, setRuleMessage] = useState<string | null>(null);

  // Region breakdown
  const regionsList = ['NWRO', 'NRO', 'WRO', 'CRO', 'ERO', 'SCRO', 'SRO', 'SWRO'];

  const filteredApps = applications.filter((app) => {
    const matchesRegion =
      selectedRegion === 'ALL' || app.institution?.region === selectedRegion;
    const matchesSearch =
      !searchQuery ||
      app.applicationNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution?.aictePid?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // KPI calculations
  const totalApps = applications.length;
  const overdueApps = applications.filter((a) => a.isOverdue).length;
  const scrutinyApps = applications.filter((a) =>
    ['SCRUTINY', 'RE_SCRUTINY'].includes(a.currentStage)
  ).length;
  const evcApps = applications.filter((a) =>
    ['EVC_SCHEDULED', 'EVC_COMPLETED'].includes(a.currentStage)
  ).length;
  const shcApps = applications.filter((a) =>
    ['SHC_HEARING', 'SAC_APPEAL'].includes(a.currentStage)
  ).length;
  const approvedApps = applications.filter((a) =>
    ['LOA_GRANTED', 'EOA_GRANTED', 'EOA_3YEAR_GRANTED', 'APPROVED'].includes(a.currentStage)
  ).length;
  const escalatedApps = applications.filter((a) => a.escalationLevel === 2).length;

  // Chart data: Stage Ageing Bottlenecks
  const stagesCount: Record<string, { stage: string; onTime: number; overdue: number }> = {};
  applications.forEach((a) => {
    const label = STAGE_LABELS[a.currentStage] || a.currentStage;
    if (!stagesCount[label]) {
      stagesCount[label] = { stage: label, onTime: 0, overdue: 0 };
    }
    if (a.isOverdue) {
      stagesCount[label].overdue++;
    } else {
      stagesCount[label].onTime++;
    }
  });
  const stageChartData = Object.values(stagesCount);

  // Chart data: Tracks distribution
  const trackCount: Record<string, number> = {};
  applications.forEach((a) => {
    const trackName = a.aphTrack || 'OTHER';
    trackCount[trackName] = (trackCount[trackName] || 0) + 1;
  });
  const trackColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  const pieData = Object.keys(trackCount).map((track, idx) => ({
    name: track.replace('_', ' '),
    value: trackCount[track],
    color: trackColors[idx % trackColors.length],
  }));

  const handleSaveRule = async (ruleId: string) => {
    try {
      setIsUpdatingRule(true);
      const res = await fetch('/api/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId, slaDays: editSlaDays }),
      });
      const data = await res.json();
      if (data.success) {
        setRuleMessage(`SLA updated successfully to ${editSlaDays} days!`);
        setEditingRuleId(null);
        setTimeout(() => setRuleMessage(null), 3000);
        onRefresh();
      }
    } catch (e: any) {
      alert('Failed to update rule');
    } finally {
      setIsUpdatingRule(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with HQ Context */}
      <div className="relative overflow-hidden rounded-xl border border-blue-900/60 bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 p-5 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[11px] font-semibold">
                CENTRAL MONITORING CONSOLE
              </span>
              <span className="text-slate-400 text-xs">AICTE New Delhi HQ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AICTE Regulation Bureau • National Pendency & SLA Compliance
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Real-time monitoring across all 8 AICTE Regional Offices. Automated state-machine routing,
              statutory compliance tracking for APH 2024-27, and algorithmic SLA breach escalation.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
            <button
              onClick={onOpenAuditLogs}
              className="px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-xs flex items-center gap-2 border border-blue-400/30 transition-all shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Verify Immutable Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Applications */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Applications</span>
            <Building className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalApps}</div>
          <div className="text-[11px] text-blue-400/80 mt-1 font-mono">Academic Year 2026-27</div>
        </div>

        {/* SLA Breaches Overdue */}
        <div className="glass-panel p-4 rounded-xl border-rose-900/60 bg-rose-950/20">
          <div className="flex items-center justify-between text-rose-300 text-xs mb-1">
            <span>SLA Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-alert-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{overdueApps}</div>
          <div className="text-[11px] text-rose-300/80 mt-1 font-mono">Requiring Urgent Action</div>
        </div>

        {/* Escalated to HQ */}
        <div className="glass-panel p-4 rounded-xl border-amber-900/60 bg-amber-950/20">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
            <span>HQ Escalated</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{escalatedApps}</div>
          <div className="text-[11px] text-amber-300/80 mt-1 font-mono">Level-2 Show Cause</div>
        </div>

        {/* In Scrutiny */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>In Scrutiny</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">{scrutinyApps}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Document Verification</div>
        </div>

        {/* In EVC Inspection */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>EVC Queue</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300">{evcApps}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Physical & Virtual</div>
        </div>

        {/* Approved / LoA */}
        <div className="glass-panel p-4 rounded-xl border-emerald-900/60 bg-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
            <span>LoA / EoA Granted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{approvedApps}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1 font-mono">Norm Compliant</div>
        </div>
      </div>

      {/* 8 Regional Jurisdictions Bar */}
      <div className="glass-panel p-4 rounded-xl border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              National Pendency by Regional Office (8 Jurisdictions)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Click region to filter table</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2">
          <button
            onClick={() => setSelectedRegion('ALL')}
            className={`p-2 rounded-lg border text-left transition-all ${
              selectedRegion === 'ALL'
                ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-300 uppercase">ALL INDIA</div>
            <div className="text-base font-bold">{applications.length}</div>
            <div className="text-[10px] text-slate-400">Total Apps</div>
          </button>

          {regionsList.map((reg) => {
            const count = applications.filter((a) => a.institution?.region === reg).length;
            const overdueCount = applications.filter(
              (a) => a.institution?.region === reg && a.isOverdue
            ).length;
            const isSelected = selectedRegion === reg;

            return (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold font-mono">{reg}</span>
                  {overdueCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>
                <div className="text-base font-bold">{count}</div>
                <div className="text-[10px] text-slate-400 truncate">
                  {REGION_DETAILS[reg]?.hq || reg}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage-wise Ageing & Bottleneck Chart */}
        <div className="glass-panel p-5 rounded-xl border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Stage-Wise Ageing Bottlenecks & SLA Health
              </h3>
              <p className="text-xs text-slate-400">
                Distribution of applications on-time vs overdue across APH stages
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="stage"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="onTime" name="Within SLA" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="overdue" name="SLA Overdue" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* APH Tracks Breakdown */}
        <div className="glass-panel p-5 rounded-xl border-slate-800">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              APH Application Tracks
            </h3>
            <p className="text-xs text-slate-400">Breakdown by statutory approval path</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 text-xs">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="truncate max-w-[170px]">{d.name}</span>
                </div>
                <span className="font-mono font-semibold">{d.value} apps</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configurable APH SLA Rules Table (Admin Super-Power) */}
      <div className="glass-panel p-5 rounded-xl border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Configurable APH SLA Rules Engine (AICTE Regulation Bureau Matrix)
            </h3>
            <p className="text-xs text-slate-400">
              Regulation Bureau Admins can modify SLA turnaround thresholds per stage & track. Changes
              recalculate application deadlines immediately.
            </p>
          </div>
          {ruleMessage && (
            <div className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
              {ruleMessage}
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">APH Track</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Current SLA Days</th>
                <th className="py-2.5 px-3">Approving Authority</th>
                <th className="py-2.5 px-3">Permitted Next Stages</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
              {rules.slice(0, 8).map((rule) => {
                const isEditing = editingRuleId === rule.id;
                let transitions: string[] = [];
                try {
                  transitions = JSON.parse(rule.allowedTransitions || '[]');
                } catch {
                  transitions = [rule.allowedTransitions];
                }

                return (
                  <tr key={rule.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono font-medium text-blue-400">
                      {rule.aphTrack}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {STAGE_LABELS[rule.stage] || rule.stage}
                    </td>
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={editSlaDays}
                            onChange={(e) => setEditSlaDays(Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-slate-900 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                          />
                          <span className="text-slate-400">days</span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800 text-blue-300 font-mono font-semibold">
                          {rule.slaDays} Days
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {rule.requiresApprovalBy}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {transitions.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveRule(rule.id)}
                            disabled={isUpdatingRule}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRuleId(null)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRuleId(rule.id);
                            setEditSlaDays(rule.slaDays);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                        >
                          Modify SLA
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications Directory & Pipeline Table */}
      <div className="glass-panel p-5 rounded-xl border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-400" />
              Live Applications Pipeline ({filteredApps.length} Shown)
            </h3>
            <p className="text-xs text-slate-400">
              Active approvals undergoing compliance verification across India
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PID, App No, or Institute..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">App No & PID</th>
                <th className="py-3 px-3">Institution Name</th>
                <th className="py-3 px-3">Region</th>
                <th className="py-3 px-3">APH Track</th>
                <th className="py-3 px-3">Current Stage</th>
                <th className="py-3 px-3">SLA Status</th>
                <th className="py-3 px-3">Escalation</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
              {filteredApps.map((app) => {
                const isOverdue = app.isOverdue;
                const deadline = new Date(app.slaDeadline);
                const deadlineStr = deadline.toLocaleDateString();

                return (
                  <tr key={app.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-white">{app.applicationNo}</div>
                      <div className="font-mono text-[10px] text-amber-400">
                        PID: {app.institution?.aictePid}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-200">{app.institution?.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {app.institution?.city}, {app.institution?.state}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-mono font-semibold">
                        {app.institution?.region}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                      {app.aphTrack}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          app.currentStage.includes('GRANTED') || app.currentStage === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : app.currentStage === 'RE_SCRUTINY'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {STAGE_LABELS[app.currentStage] || app.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isOverdue ? (
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 animate-alert-pulse" />
                          <span>BREACHED ({app.ageingDays}d elapsed)</span>
                        </div>
                      ) : (
                        <div className="text-slate-300 font-mono">
                          <span className="text-emerald-400 font-semibold">On Track</span>
                          <span className="text-[10px] text-slate-500 ml-1">Due {deadlineStr}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {app.escalationLevel === 2 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold text-[10px]">
                          LEVEL-2 (HQ)
                        </span>
                      ) : app.escalationLevel === 1 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-300 font-medium text-[10px]">
                          LEVEL-1 (RO)
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[10px]">Normal</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectApplicationForScrutiny(app)}
                        className="px-2.5 py-1 rounded bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-xs inline-flex items-center gap-1 transition-all"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
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
