'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Activity,
  FileCheck,
  AlertTriangle,
  History,
  TrendingUp,
  RefreshCw,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Zap,
  BarChart3,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { BlackHole } from '@/components/3d/BlackHole';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface AnalyticsData {
  summary: {
    totalCases: number;
    activeCases: number;
    closedCases: number;
    pendingVerificationCases: number;
    escalatedCases: number;
    totalReferrals: number;
    pendingReferrals: number;
    acceptedReferrals: number;
    rejectedReferrals: number;
    totalDeliveries: number;
    verifiedDeliveries: number;
    overdueFollowUps: number;
    totalIndividuals: number;
    verificationRate: number;
  };
  resourceSummary: Array<{
    id: string;
    name: string;
    type: string;
    total: number;
    available: number;
    utilized: number;
    percent: number;
  }>;
  recentAuditLogs: Array<{
    id: string;
    actorEmail: string;
    actorRole: string;
    action: string;
    entity: string;
    details: string | null;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'organisations' | 'audit' | 'policies'>('overview');
  const [auditFilter, setAuditFilter] = useState('ALL');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const organisations = [
    { name: 'Dept. of Social Welfare & Inclusion', type: 'GOVERNMENT', jurisdiction: 'District 1-4', lead: 'Director Elena Vance', email: 'admin@aidbridge.local', status: 'ACTIVE' },
    { name: 'StreetConnect Field Outreach Alliance', type: 'OUTREACH_NGO', jurisdiction: 'Metro Core & Transit', lead: 'Marcus Chen', email: 'outreach@aidbridge.local', status: 'ACTIVE' },
    { name: 'Hope Haven Sanctuary & Emergency Shelter', type: 'SHELTER', jurisdiction: 'East River Community', lead: 'Sarah Jenkins', email: 'shelter@aidbridge.local', status: 'ACTIVE' },
    { name: 'St. Jude Metropolitan Health System', type: 'HOSPITAL', jurisdiction: 'Regional Health District', lead: 'Dr. Tariq Mahmood', email: 'hospital@aidbridge.local', status: 'ACTIVE' },
    { name: 'Unified Social Care Coordination Bureau', type: 'CASE_MGMT', jurisdiction: 'Cross-Agency Liaison', lead: 'Amara Patel', email: 'manager@aidbridge.local', status: 'ACTIVE' },
  ];

  const filteredLogs = data?.recentAuditLogs?.filter((log) => {
    if (auditFilter === 'ALL') return true;
    return log.action.toUpperCase() === auditFilter.toUpperCase();
  }) || [];

  return (
    <div className="space-y-8 animate-fade-in text-[#182536]">
      {/* Page Header with Action & Refresh */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#182536]">
              Government Administration
            </h1>
            <span className="rounded-full bg-[#E8F3F0] border border-[#176B67]/30 px-3 py-1 text-xs font-mono font-bold text-[#176B67]">
              POLICY DESK
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Municipal oversight, cross-agency verification audits, and real-time resource allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-mono font-semibold text-[#182536] hover:bg-[#F5F3EC] border border-[#E4E8E5] shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#176B67]' : 'text-[#64748B]'}`} />
            <span>Sync Audit Feed</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics Cards (Pure White with Subtle Borders) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card hover:border-[#176B67]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">Total Individuals</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F3F0] border border-[#176B67]/30 flex items-center justify-center text-[#176B67]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-[#101D32] tracking-tight">
            {data?.summary?.totalIndividuals ?? 48}
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#176B67] font-semibold">Active municipal casework</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card hover:border-[#101D32]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">Total Cases</span>
            <div className="w-8 h-8 rounded-xl bg-[#101D32]/10 border border-[#101D32]/20 flex items-center justify-center text-[#101D32]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-[#101D32] tracking-tight">
            {data?.summary?.totalCases ?? 12}
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#64748B]">
            {data?.summary?.activeCases ?? 8} currently in transit/progress
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card hover:border-[#21845A]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">Verification Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#21845A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-[#21845A] tracking-tight">
            {data?.summary?.verificationRate ? `${data.summary.verificationRate}%` : '100%'}
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#21845A]">
            {data?.summary?.verifiedDeliveries ?? 9} physical deliveries confirmed
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card hover:border-[#D49A35]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D49A35]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-[#D49A35] tracking-tight">
            {data?.summary?.pendingVerificationCases ?? 3}
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#D49A35]">Awaiting dual-key verification</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E8E5] pb-3">
        {[
          { key: 'overview', label: 'Ecosystem Overview', icon: <Layers className="w-4 h-4" /> },
          { key: 'organisations', label: 'Participating Agencies', icon: <Building2 className="w-4 h-4" /> },
          { key: 'audit', label: 'Cryptographic Audit Trail', icon: <History className="w-4 h-4" /> },
          { key: 'policies', label: 'Civic Policy Gates', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-[#176B67] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:text-[#182536] hover:bg-[#F5F3EC] border border-[#E4E8E5]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview with Black Hole Pulse Widget */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Left: Capacity Matrix */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E8E5] shadow-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#182536] tracking-tight">
                    Municipal Bed &amp; Resource Availability
                  </h3>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">
                    Live inventory synchronized with participating shelter &amp; clinical wards.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#176B67] bg-[#E8F3F0] border border-[#176B67]/30 px-2 py-0.5 rounded-full font-bold">
                  LIVE SYNC
                </span>
              </div>

              <div className="space-y-4">
                {(data?.resourceSummary || [
                  { id: '1', name: 'Emergency Sanctuary Beds', type: 'EMERGENCY_BED', total: 40, available: 18, utilized: 22, percent: 55 },
                  { id: '2', name: 'Clinical Respite Beds', type: 'MEDICAL_BED', total: 18, available: 4, utilized: 14, percent: 78 },
                  { id: '3', name: 'Emergency Caloric Ration Packs', type: 'MEAL_PACK', total: 250, available: 185, utilized: 65, percent: 26 },
                ]).map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#182536] font-bold">{r.name}</span>
                      <span className="text-[#176B67] font-bold">
                        {r.available} Available / {r.total} Total
                      </span>
                    </div>
                    <div className="w-full bg-[#E4E8E5] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          r.percent > 75
                            ? 'bg-[#C94C4C]'
                            : r.percent > 45
                            ? 'bg-[#176B67]'
                            : 'bg-[#21845A]'
                        }`}
                        style={{ width: `${r.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                      <span>{r.percent}% Capacity Utilized</span>
                      <span>Target SLA: &lt;85%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Black Hole Ambient Ecosystem Widget in Midnight Navy Card */}
            <div className="lg:col-span-5 bg-[#101D32] text-white p-6 rounded-3xl border border-[#176B67]/30 shadow-card flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#35A99A] animate-ping" />
                  <span className="text-xs font-mono font-bold text-white">ECOSYSTEM GRAVITATIONAL MONITOR</span>
                </div>
                <span className="text-[10px] font-mono text-[#D8B77A]">WARD 1-5 MESH</span>
              </div>

              {/* 3D Black Hole Widget */}
              <div className="h-[240px] w-full rounded-2xl overflow-hidden relative my-3">
                <BlackHole
                  particleCount={2000}
                  size={0.8}
                  interactive={true}
                  showTelemetry={false}
                />
              </div>

              <div className="z-10 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#F5F3EC]/80">
                <span>Verification Pipeline:</span>
                <span className="text-[#35A99A] font-bold">0 UNRESOLVED VOIDS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Organisations */}
      {activeTab === 'organisations' && (
        <div className="bg-white rounded-3xl border border-[#E4E8E5] shadow-card overflow-hidden">
          <div className="p-6 border-b border-[#E4E8E5] flex items-center justify-between">
            <h3 className="text-base font-bold text-[#182536]">Registered Stakeholder Agencies</h3>
            <span className="text-xs font-mono text-[#64748B]">5 ACTIVE CO-DESKS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F3EC] text-[#64748B] border-b border-[#E4E8E5]">
                <tr>
                  <th className="px-6 py-4">Organisation Name</th>
                  <th className="px-6 py-4">Sector Type</th>
                  <th className="px-6 py-4">Jurisdiction</th>
                  <th className="px-6 py-4">Lead Officer</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E8E5]">
                {organisations.map((org) => (
                  <tr key={org.name} className="hover:bg-[#F5F3EC]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#182536] font-sans">{org.name}</td>
                    <td className="px-6 py-4 text-[#176B67] font-semibold">{org.type}</td>
                    <td className="px-6 py-4 text-[#64748B]">{org.jurisdiction}</td>
                    <td className="px-6 py-4 text-[#182536]">
                      <div>{org.lead}</div>
                      <div className="text-[10px] text-[#64748B]">{org.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] text-[#21845A] font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cryptographic Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#E4E8E5] shadow-card overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#182536]">Unalterable Audit Ledger</h3>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Every referral creation, admission proof, and verification signoff is recorded.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['ALL', 'VERIFY', 'CREATE', 'CLOSE'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setAuditFilter(flt)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    auditFilter === flt
                      ? 'bg-[#176B67] text-white shadow-sm'
                      : 'bg-[#F5F3EC] text-[#64748B] hover:text-[#182536]'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E4E8E5] max-h-[500px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[#64748B]">
                No audit entries match filter.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#E8F3F0] text-[#176B67] border border-[#176B67]/30 text-[10px] font-bold">
                        {log.action}
                      </span>
                      <span className="text-[#182536] font-semibold font-sans">{log.entity}</span>
                      <span className="text-[#64748B] text-[10px]">by {log.actorEmail}</span>
                    </div>
                    {log.details && <p className="text-[#64748B] text-[11px]">{log.details}</p>}
                  </div>
                  <span className="text-[#64748B] text-[10px] shrink-0 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Civic Policy Gates */}
      {activeTab === 'policies' && (
        <div className="bg-white p-8 rounded-3xl border border-[#E4E8E5] shadow-card space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-[#182536] tracking-tight">
              Enforced Platform Invariants
            </h3>
            <p className="text-xs text-[#64748B] font-mono mt-1">
              Cryptographically validated rules preventing case mismanagement.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-2">
              <span className="text-xs font-mono font-bold text-[#176B67]">RULE #1: DUAL-KEY CLOSURE</span>
              <p className="text-xs text-[#182536] leading-relaxed font-normal">
                A case CANNOT be closed merely because a referral was created or accepted. Actual
                service delivery must be verified by an authorized Case Manager.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-2">
              <span className="text-xs font-mono font-bold text-[#101D32]">RULE #2: MANDATORY TURN-AWAY LOGGING</span>
              <p className="text-xs text-[#182536] leading-relaxed font-normal">
                Providers cannot silently drop referrals. Any turn-away requires documented capacity
                reasons logged to the audit ledger.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-2">
              <span className="text-xs font-mono font-bold text-[#D8B77A]">RULE #3: RADICAL DATA MINIMIZATION</span>
              <p className="text-xs text-[#182536] leading-relaxed font-normal">
                Street outreach is executed without requiring state identification or biometrics,
                protecting vulnerable individuals from surveillance barriers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-2">
              <span className="text-xs font-mono font-bold text-[#21845A]">RULE #4: STRUCTURED 30-DAY TOUCHPOINTS</span>
              <p className="text-xs text-[#182536] leading-relaxed font-normal">
                Follow-up checks track long-term permanent stabilization, preventing recipient recidivism.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
