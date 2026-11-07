'use client';

import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Bed,
  Users,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  MapPin,
  Clock,
  X,
  ArrowRight,
} from 'lucide-react';
import { BlackHole } from '@/components/3d/BlackHole';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface ReferralItem {
  id: string;
  caseId: string;
  requestedService: string;
  priority: string;
  status: string;
  notes: string | null;
  rejectionReason: string | null;
  createdAt: string;
  case: {
    caseNumber: string;
    title: string;
    individual: {
      firstName: string;
      lastName: string;
      ageCategory: string;
      approximateAge: number | null;
      currentLocus: string | null;
      safeguardingFlags: string | null;
    };
  };
}

export default function ShelterDashboardPage() {
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [capacity, setCapacity] = useState({ total: 40, available: 18 });

  // Rejection modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Service delivery intake modal state
  const [admittingRef, setAdmittingRef] = useState<ReferralItem | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [locationNotes, setLocationNotes] = useState('Hope Haven Sanctuary Main Center, Bed #B-14');
  const [deliverySuccess, setDeliverySuccess] = useState('');

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/referrals');
      if (res.ok) {
        const json = await res.json();
        setReferrals(json.referrals || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleUpdateCapacity = async (delta: number) => {
    const newAvail = Math.max(0, Math.min(capacity.total, capacity.available + delta));
    setCapacity((prev) => ({ ...prev, available: newAvail }));
    try {
      await fetch('/api/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'provider-shelter-id',
          capacityAvailable: newAvail,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptReferral = async (referralId: string) => {
    try {
      const res = await fetch('/api/referrals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId,
          action: 'ACCEPT',
          notes: 'Accepted by Hope Haven Shelter Coordinator.',
        }),
      });
      if (res.ok) {
        fetchReferrals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId || !rejectionReason.trim()) return;

    try {
      const res = await fetch('/api/referrals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId: rejectingId,
          action: 'REJECT',
          rejectionReason,
        }),
      });
      if (res.ok) {
        setRejectingId(null);
        setRejectionReason('');
        fetchReferrals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admittingRef || !deliveryNotes.trim()) return;

    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId: admittingRef.id,
          serviceType: 'Emergency Shelter & Bed Allocation',
          evidenceNotes: deliveryNotes,
          locationNotes,
        }),
      });

      if (res.ok) {
        setDeliverySuccess(`Admission recorded! Dual-key verification dispatched to Case Manager.`);
        setAdmittingRef(null);
        setDeliveryNotes('');
        handleUpdateCapacity(-1);
        fetchReferrals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#182536]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#182536]">
              Shelter Coordinator Desk
            </h1>
            <span className="rounded-full bg-[#E8F3F0] border border-[#176B67]/30 px-3 py-1 text-xs font-mono font-bold text-[#176B67]">
              SANCTUARY DESK
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Real-time bed allocation, documented admissions, and capacity quota management.
          </p>
        </div>

        <button
          onClick={fetchReferrals}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-mono font-semibold text-[#182536] hover:bg-[#F5F3EC] border border-[#E4E8E5] shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#176B67]' : 'text-[#64748B]'}`} />
          <span>Sync Bed Referrals</span>
        </button>
      </div>

      {deliverySuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F3F0] border border-[#176B67]/30 text-[#21845A] text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#21845A] shrink-0" />
            <span>{deliverySuccess}</span>
          </span>
          <button onClick={() => setDeliverySuccess('')} className="text-[#64748B] hover:text-[#182536]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Capacity & 3D Ecosystem Pulse Cards */}
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        {/* Bed Counter Card (Pure White) */}
        <div className="lg:col-span-8 bg-white p-7 rounded-3xl border border-[#E4E8E5] shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#176B67] uppercase font-bold block mb-1">
                Hope Haven Sanctuary
              </span>
              <h3 className="text-xl font-bold text-[#182536] tracking-tight">Live Bed Inventory</h3>
            </div>

            {/* Quick +/- Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateCapacity(-1)}
                className="w-9 h-9 rounded-xl bg-[#F5F3EC] border border-[#E4E8E5] flex items-center justify-center text-[#182536] hover:bg-white hover:border-[#C94C4C] transition-all"
                title="Decrement Bed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdateCapacity(1)}
                className="w-9 h-9 rounded-xl bg-[#F5F3EC] border border-[#E4E8E5] flex items-center justify-center text-[#182536] hover:bg-white hover:border-[#176B67] transition-all"
                title="Increment Bed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5]">
              <span className="text-[11px] font-mono text-[#64748B] block mb-1">Available Beds</span>
              <div className="text-3xl font-mono font-black text-[#176B67]">{capacity.available}</div>
              <div className="text-[10px] font-mono text-[#176B67] mt-1 font-semibold">Ready for intake</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5]">
              <span className="text-[11px] font-mono text-[#64748B] block mb-1">Occupied Beds</span>
              <div className="text-3xl font-mono font-black text-[#101D32]">
                {capacity.total - capacity.available}
              </div>
              <div className="text-[10px] font-mono text-[#64748B] mt-1">Verified admissions</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5]">
              <span className="text-[11px] font-mono text-[#64748B] block mb-1">Total Capacity</span>
              <div className="text-3xl font-mono font-black text-[#D8B77A]">{capacity.total}</div>
              <div className="text-[10px] font-mono text-[#64748B] mt-1">Municipal quota locked</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>Sanctuary Occupancy:</span>
              <span className="text-[#182536] font-bold">
                {Math.round(((capacity.total - capacity.available) / capacity.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#E4E8E5] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#176B67] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((capacity.total - capacity.available) / capacity.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 3D Black Hole Mini Pulse Widget in Midnight Navy Container */}
        <div className="lg:col-span-4 bg-[#101D32] text-white p-6 rounded-3xl border border-[#176B67]/30 shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between z-10 text-xs font-mono">
            <span className="text-white font-bold">CO-COORDINATED ORBIT</span>
            <span className="text-[#35A99A] font-bold">LIVE</span>
          </div>

          <div className="h-[180px] w-full rounded-2xl overflow-hidden relative my-2">
            <BlackHole
              particleCount={1800}
              size={0.75}
              interactive={false}
              showTelemetry={false}
            />
          </div>

          <div className="z-10 pt-2 border-t border-white/10 text-[11px] font-mono text-[#F5F3EC]/80 flex items-center justify-between">
            <span>Incoming Triage Queue</span>
            <span className="text-[#35A99A] font-bold">
              {referrals.filter((r) => r.status === 'PENDING').length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Incoming Shelter Referrals Table */}
      <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#182536] tracking-tight">Incoming Shelter Referrals</h3>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Review and admit street referrals with mandatory physical intake evidence.
            </p>
          </div>
          <span className="text-xs font-mono text-[#176B67] font-semibold">
            {referrals.length} Total Referrals
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E4E8E5]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F5F3EC] text-[#64748B] border-b border-[#E4E8E5]">
              <tr>
                <th className="px-5 py-3.5">Beneficiary / Case</th>
                <th className="px-5 py-3.5">Requested Aid</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E8E5]">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#64748B]">
                    No active shelter referrals in queue.
                  </td>
                </tr>
              ) : (
                referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5F3EC]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#182536] font-sans text-sm">
                        {r.case?.individual?.firstName} {r.case?.individual?.lastName}
                      </div>
                      <div className="text-[#176B67] text-[11px] font-semibold">{r.case?.caseNumber}</div>
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">
                      <div className="text-[#182536] font-medium">{r.requestedService}</div>
                      {r.notes && <div className="text-[10px] text-[#64748B] mt-0.5">{r.notes}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.priority === 'CRITICAL'
                            ? 'bg-rose-50 text-[#C94C4C] border border-rose-200'
                            : r.priority === 'HIGH'
                            ? 'bg-amber-50 text-[#D49A35] border border-amber-200'
                            : 'bg-[#E8F3F0] text-[#176B67] border border-[#176B67]/20'
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-[#21845A] border border-emerald-200'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-50 text-[#C94C4C] border border-rose-200'
                            : 'bg-[#E8F3F0] text-[#176B67] border border-[#176B67]/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {r.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAcceptReferral(r.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#176B67] hover:bg-[#125855] text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setRejectingId(r.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#C94C4C] border border-rose-200 text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {r.status === 'ACCEPTED' && (
                        <button
                          onClick={() => setAdmittingRef(r)}
                          className="px-3 py-1.5 rounded-lg bg-[#E8F3F0] hover:bg-[#d6eae5] text-[#176B67] border border-[#176B67]/30 text-xs font-bold transition-all"
                        >
                          Record Admission
                        </button>
                      )}

                      {r.status === 'REJECTED' && (
                        <span className="text-[11px] text-[#64748B]">Documented</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Admission Modal (Pure White Card) */}
      {admittingRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D32]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full p-7 rounded-3xl border border-[#E4E8E5] shadow-2xl space-y-5 text-[#182536]">
            <div className="flex items-center justify-between border-b border-[#E4E8E5] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#182536] tracking-tight">Record Physical Admission</h3>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Confirm bed allocation receipt for {admittingRef.case?.individual?.firstName}.
                </p>
              </div>
              <button onClick={() => setAdmittingRef(null)} className="text-[#64748B] hover:text-[#182536]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordDelivery} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                  Assigned Bed &amp; Shelter Location
                </label>
                <input
                  type="text"
                  required
                  value={locationNotes}
                  onChange={(e) => setLocationNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                  Intake Evidence &amp; Condition Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Beneficiary arrived with outreach worker, bed #B-14 allocated, overnight pack provided..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] font-sans resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#E8F3F0] border border-[#176B67]/20 text-[11px] text-[#176B67] font-mono">
                NOTICE: Case will shift to PENDING_VERIFICATION. Dual-key signoff by Case Manager required.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdmittingRef(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#182536]"
                >
                  Cancel
                </button>
                <PremiumButton type="submit" variant="primary" size="sm" withArrow>
                  Certify Physical Intake
                </PremiumButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Justification Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D32]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full p-7 rounded-3xl border border-[#E4E8E5] shadow-2xl space-y-4 text-[#182536]">
            <div className="flex items-center justify-between border-b border-[#E4E8E5] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#182536] tracking-tight">Turn-Away Justification</h3>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Mandatory reason required for audit compliance.
                </p>
              </div>
              <button onClick={() => setRejectingId(null)} className="text-[#64748B] hover:text-[#182536]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectReferral} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                  Reason for Non-Admission
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Ward is at maximum fire code capacity; redirected to East River Sanctuary..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#C94C4C] font-sans resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#182536]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C94C4C] hover:bg-[#b03e3e] text-white text-xs font-mono font-bold transition-all shadow-sm"
                >
                  Log Turn-Away to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
