'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  RefreshCw,
  Eye,
  AlertCircle,
  FolderCheck,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { BlackHole } from '@/components/3d/BlackHole';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface CaseDetail {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  priority: string;
  closedAt: string | null;
  closeReason: string | null;
  createdAt: string;
  individual: {
    id: string;
    caseId: string;
    firstName: string;
    lastName: string;
    ageCategory: string;
    approximateAge: number | null;
    currentLocus: string | null;
    safeguardingFlags: string | null;
    consentNotes: string | null;
  };
  needsAssessments: Array<{
    id: string;
    category: string;
    urgency: string;
    notes: string | null;
  }>;
  referrals: Array<{
    id: string;
    requestedService: string;
    status: string;
    provider: { name: string; type: string };
    deliveries: Array<{
      id: string;
      serviceType: string;
      deliveredAt: string;
      evidenceNotes: string | null;
      locationNotes: string | null;
      verified: boolean;
      verifications: Array<{
        id: string;
        status: string;
        remarks: string;
        verifiedAt: string;
      }>;
    }>;
  }>;
  deliveries: Array<{
    id: string;
    serviceType: string;
    deliveredAt: string;
    evidenceNotes: string | null;
    locationNotes: string | null;
    verified: boolean;
    verifications: Array<{
      id: string;
      status: string;
      remarks: string;
      verifiedAt: string;
    }>;
  }>;
  followUps: Array<{
    id: string;
    scheduledDate: string;
    status: string;
    notes: string | null;
    outcome: string | null;
  }>;
  timelines: Array<{
    id: string;
    eventType: string;
    title: string;
    description: string;
    createdAt: string;
  }>;
}

export default function CaseManagerDashboardPage() {
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'verification' | 'caseload'>('verification');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Inspection & verification drawer modal
  const [selectedCase, setSelectedCase] = useState<CaseDetail | null>(null);
  const [verifyRemarks, setVerifyRemarks] = useState('Verified physical service delivery against provider intake receipt.');
  const [closeReason, setCloseReason] = useState('Permanent stabilization verified with follow-up scheduled.');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cases');
      if (res.ok) {
        const json = await res.json();
        setCases(json.cases || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Handle Dual-Key Delivery Verification
  const handleVerifyDelivery = async (deliveryId: string, caseId: string) => {
    setActionLoading(true);
    setActionSuccess('');
    try {
      const res = await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceDeliveryId: deliveryId,
          caseId,
          remarks: verifyRemarks,
          status: 'CONFIRMED',
        }),
      });

      if (res.ok) {
        setActionSuccess('Dual-key verification confirmed on ledger! Case is now eligible for guarded closure.');
        fetchCases();
        // Update local selected case state
        if (selectedCase && selectedCase.id === caseId) {
          const updated = { ...selectedCase, status: 'VERIFIED' };
          setSelectedCase(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Guarded Case Closure
  const handleCloseCase = async (caseId: string) => {
    setActionLoading(true);
    setActionSuccess('');
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          action: 'CLOSE',
          closeReason,
        }),
      });

      if (res.ok) {
        setActionSuccess('Case formally closed with complete verification provenance!');
        fetchCases();
        setSelectedCase(null);
      } else {
        const err = await res.json();
        setActionSuccess(`Cannot close: ${err.error || 'Verification conditions unmet.'}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Cases pending verification (status is PENDING_VERIFICATION or has unverified deliveries)
  const pendingVerificationCases = cases.filter(
    (c) =>
      c.status === 'PENDING_VERIFICATION' ||
      c.deliveries?.some((d) => !d.verified) ||
      c.referrals?.some((r) => r.deliveries?.some((d) => !d.verified))
  );

  const filteredCaseload = cases.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      `${c.individual.firstName} ${c.individual.lastName}`.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in text-[#182536]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#182536]">
              Case Manager Stewardship Desk
            </h1>
            <span className="rounded-full bg-[#E8F3F0] border border-[#176B67]/30 px-3 py-1 text-xs font-mono font-bold text-[#176B67]">
              VERIFICATION GATE
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Independent dual-key delivery verification, cross-agency coordination, and guarded case closure.
          </p>
        </div>

        <button
          onClick={fetchCases}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-mono font-semibold text-[#182536] hover:bg-[#F5F3EC] border border-[#E4E8E5] shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#176B67]' : 'text-[#64748B]'}`} />
          <span>Sync Case Ledger</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F3F0] border border-[#176B67]/30 text-[#21845A] text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#21845A] shrink-0" />
            <span>{actionSuccess}</span>
          </span>
          <button onClick={() => setActionSuccess('')} className="text-[#64748B] hover:text-[#182536]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Banner with 3D Black Hole Convergence Widget */}
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 grid gap-4 sm:grid-cols-3">
          <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] shadow-card">
            <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">
              Awaiting Verification
            </span>
            <div className="text-3xl font-mono font-black text-[#D49A35]">
              {pendingVerificationCases.length}
            </div>
            <div className="text-[10px] font-mono text-[#D49A35] mt-1 font-semibold">Dual-key signoff required</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] shadow-card">
            <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">
              Total Active Trajectories
            </span>
            <div className="text-3xl font-mono font-black text-[#101D32]">
              {cases.filter((c) => c.status !== 'CLOSED').length}
            </div>
            <div className="text-[10px] font-mono text-[#176B67] mt-1 font-semibold">Multi-agency coordination</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] shadow-card">
            <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">
              Verified &amp; Closed
            </span>
            <div className="text-3xl font-mono font-black text-[#21845A]">
              {cases.filter((c) => c.status === 'CLOSED').length}
            </div>
            <div className="text-[10px] font-mono text-[#21845A] mt-1 font-semibold">Guarded closure achieved</div>
          </div>
        </div>

        {/* 3D Black Hole Verification Core Widget in Midnight Navy Container */}
        <div className="lg:col-span-4 bg-[#101D32] text-white p-5 rounded-2xl border border-[#176B67]/30 shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-[#F5F3EC]/80 z-10">
            <span className="text-white font-bold">VERIFICATION EQUILIBRIUM</span>
            <span className="text-[#D8B77A] font-bold">GUARDED</span>
          </div>

          <div className="h-[150px] w-full rounded-xl overflow-hidden relative my-2">
            <BlackHole
              particleCount={1900}
              size={0.75}
              interactive={false}
              showTelemetry={false}
            />
          </div>

          <div className="z-10 text-[10px] font-mono text-[#F5F3EC]/80 flex items-center justify-between">
            <span>Guarded Invariant:</span>
            <span className="text-[#35A99A] font-bold">ZERO PREMATURE CLOSURES</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E8E5] pb-3">
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'verification'
              ? 'bg-[#176B67] text-white shadow-sm'
              : 'bg-white text-[#64748B] hover:text-[#182536] hover:bg-[#F5F3EC] border border-[#E4E8E5]'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Verification Desk ({pendingVerificationCases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('caseload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'caseload'
              ? 'bg-[#176B67] text-white shadow-sm'
              : 'bg-white text-[#64748B] hover:text-[#182536] hover:bg-[#F5F3EC] border border-[#E4E8E5]'
          }`}
        >
          <FolderCheck className="w-4 h-4" />
          <span>Master Caseload ({cases.length})</span>
        </button>
      </div>

      {/* Tab 1: Verification Desk */}
      {activeTab === 'verification' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E8E5] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#182536] tracking-tight">
                Deliveries Awaiting Dual-Key Certification
              </h3>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Physical provider deliveries recorded on the ledger. Review evidence notes and sign off.
              </p>
            </div>
          </div>

          {pendingVerificationCases.length === 0 ? (
            <div className="py-16 text-center text-xs font-mono text-[#64748B]">
              <CheckCircle2 className="w-8 h-8 text-[#21845A] mx-auto mb-2" />
              <span>All recorded service deliveries are verified! Zero verification backlog.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVerificationCases.map((c) => {
                // Find unverified deliveries in this case
                const unverifiedList = [
                  ...(c.deliveries?.filter((d) => !d.verified) || []),
                  ...(c.referrals?.flatMap((r) => r.deliveries?.filter((d) => !d.verified)) || []),
                ];

                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] hover:border-[#176B67]/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-[#182536]">
                            {c.individual.firstName} {c.individual.lastName}
                          </h4>
                          <span className="text-[#176B67] font-mono text-xs font-bold">
                            {c.caseNumber}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5">{c.title}</p>
                      </div>

                      <PremiumButton
                        onClick={() => setSelectedCase(c)}
                        variant="primary"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect Trajectory &amp; Sign
                      </PremiumButton>
                    </div>

                    {unverifiedList.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#E4E8E5]">
                        <span className="text-[11px] font-mono text-[#D49A35] uppercase font-bold block">
                          Recorded Delivery Receipts to Verify:
                        </span>
                        {unverifiedList.map((del) => (
                          <div
                            key={del.id}
                            className="p-3.5 rounded-xl bg-white border border-[#E4E8E5] text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                          >
                            <div className="space-y-1">
                              <span className="text-[#182536] font-bold">{del.serviceType}</span>
                              <p className="text-[#64748B] text-[11px] font-sans">
                                Evidence: {del.evidenceNotes || 'Physical receipt logged by coordinator.'}
                              </p>
                              {del.locationNotes && (
                                <p className="text-[#176B67] text-[10px]">Locus: {del.locationNotes}</p>
                              )}
                            </div>

                            <button
                              onClick={() => handleVerifyDelivery(del.id, c.id)}
                              disabled={actionLoading}
                              className="px-3.5 py-1.5 rounded-lg bg-[#21845A] hover:bg-[#1a6a48] text-white text-xs font-bold shrink-0 self-start sm:self-auto shadow-sm transition-all"
                            >
                              Dual-Key Sign Off
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Master Caseload */}
      {activeTab === 'caseload' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search case #, individual name, or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F5F3EC] border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-xs focus:outline-none focus:border-[#176B67] focus:bg-white font-sans transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'OPEN', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'VERIFIED', 'CLOSED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                    statusFilter === st
                      ? 'bg-[#176B67] text-white shadow-sm'
                      : 'bg-[#F5F3EC] text-[#64748B] hover:text-[#182536]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E4E8E5]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F3EC] text-[#64748B] border-b border-[#E4E8E5]">
                <tr>
                  <th className="px-5 py-3.5">Beneficiary / Case</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Deliveries</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E8E5]">
                {filteredCaseload.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[#64748B]">
                      No cases match current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCaseload.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F5F3EC]/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#182536] font-sans text-sm">
                          {c.individual.firstName} {c.individual.lastName}
                        </div>
                        <div className="text-[#176B67] text-[11px] font-semibold">{c.caseNumber}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.priority === 'CRITICAL'
                              ? 'bg-rose-50 text-[#C94C4C] border border-rose-200'
                              : 'bg-[#E8F3F0] text-[#176B67] border border-[#176B67]/20'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#64748B]">
                        {c.deliveries?.length || c.referrals?.flatMap((r) => r.deliveries).length || 0} logged
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F5F3EC] border border-[#E4E8E5] text-[#182536] text-[10px] font-semibold">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedCase(c)}
                          className="px-3 py-1.5 rounded-lg bg-[#E8F3F0] hover:bg-[#d6eae5] text-[#176B67] border border-[#176B67]/30 text-xs font-bold transition-all"
                        >
                          View Trajectory
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Case Details & Guarded Closure Drawer/Modal (Pure White Card) */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D32]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-3xl w-full p-7 rounded-3xl border border-[#E4E8E5] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-[#182536]">
            <div className="flex items-center justify-between border-b border-[#E4E8E5] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#182536] tracking-tight">
                    {selectedCase.individual.firstName} {selectedCase.individual.lastName}
                  </h3>
                  <span className="text-[#176B67] font-mono text-xs font-bold">
                    {selectedCase.caseNumber}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">{selectedCase.title}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-[#64748B] hover:text-[#182536]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Individual Profile & Locus */}
            <div className="grid gap-4 sm:grid-cols-3 p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] text-xs font-mono">
              <div>
                <span className="text-[#64748B] uppercase block text-[10px]">Current Locus</span>
                <span className="text-[#182536] font-bold">{selectedCase.individual.currentLocus || 'Field Encounter'}</span>
              </div>
              <div>
                <span className="text-[#64748B] uppercase block text-[10px]">Age Bracket</span>
                <span className="text-[#182536] font-medium">{selectedCase.individual.ageCategory} (~{selectedCase.individual.approximateAge || 'N/A'} yrs)</span>
              </div>
              <div>
                <span className="text-[#64748B] uppercase block text-[10px]">Case Status</span>
                <span className="text-[#176B67] font-bold">{selectedCase.status}</span>
              </div>
            </div>

            {/* Guarded Closure Rule Box */}
            <div className="p-4 rounded-2xl bg-[#E8F3F0] border border-[#176B67]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#176B67]">
                <ShieldCheck className="w-4 h-4 text-[#176B67]" />
                <span>GUARDED CLOSURE VERIFICATION PROTOCOL</span>
              </div>
              <p className="text-xs text-[#182536] leading-relaxed font-normal">
                CRITICAL INVARIANT: Cases cannot be closed merely on referral creation.
                Physical service delivery must be recorded by providers and independently verified
                by the Case Manager before closure certification is enabled.
              </p>
            </div>

            {/* Deliveries & Verifications Status */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-[#182536] uppercase font-bold">
                Logged Deliveries &amp; Verification Status:
              </h4>
              {selectedCase.deliveries?.length === 0 && (!selectedCase.referrals || selectedCase.referrals.every((r) => !r.deliveries || r.deliveries.length === 0)) ? (
                <div className="p-4 rounded-xl bg-[#F5F3EC] text-xs font-mono text-[#64748B] text-center border border-[#E4E8E5]">
                  Zero service deliveries logged yet. Provider must record intake receipt before case can be verified.
                </div>
              ) : (
                [
                  ...(selectedCase.deliveries || []),
                  ...(selectedCase.referrals?.flatMap((r) => r.deliveries || []) || []),
                ].map((del) => (
                  <div
                    key={del.id}
                    className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#182536] font-bold">{del.serviceType}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          del.verified
                            ? 'bg-emerald-50 text-[#21845A] border border-emerald-200'
                            : 'bg-amber-50 text-[#D49A35] border border-amber-200'
                        }`}
                      >
                        {del.verified ? 'DUAL-KEY VERIFIED' : 'PENDING VERIFICATION'}
                      </span>
                    </div>
                    <p className="text-[#64748B] font-sans text-xs">
                      Evidence: {del.evidenceNotes || 'Provider physical intake documented.'}
                    </p>
                    {del.locationNotes && (
                      <p className="text-[#176B67] text-[10px]">Location: {del.locationNotes}</p>
                    )}

                    {!del.verified && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleVerifyDelivery(del.id, selectedCase.id)}
                          disabled={actionLoading}
                          className="px-3.5 py-1.5 rounded-lg bg-[#21845A] hover:bg-[#1a6a48] text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Confirm Delivery Sign-Off
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Case Closure Section */}
            {selectedCase.status !== 'CLOSED' && (
              <div className="pt-4 border-t border-[#E4E8E5] space-y-3">
                <span className="text-xs font-mono text-[#182536] uppercase font-bold block">
                  Guarded Case Resolution
                </span>
                <input
                  type="text"
                  placeholder="Closure justification (e.g. Permanent housing lease signed)..."
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] font-sans"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#182536]"
                  >
                    Cancel
                  </button>

                  <PremiumButton
                    onClick={() => handleCloseCase(selectedCase.id)}
                    variant="primary"
                    size="sm"
                    isLoading={actionLoading}
                    disabled={selectedCase.status === 'OPEN' || selectedCase.status === 'REFERRED'}
                  >
                    Certify &amp; Close Case
                  </PremiumButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
