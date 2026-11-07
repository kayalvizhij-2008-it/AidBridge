'use client';

import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Bed,
  RefreshCw,
  Plus,
  Minus,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  X,
  ArrowRight,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
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

export default function HospitalDashboardPage() {
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicalBeds, setMedicalBeds] = useState({ total: 18, available: 4 });
  const [admittingRef, setAdmittingRef] = useState<ReferralItem | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [facilityLocus, setFacilityLocus] = useState('St. Jude Community Clinic Pavilion B');
  const [feedbackMsg, setFeedbackMsg] = useState('');

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

  const handleAccept = async (referralId: string) => {
    try {
      const res = await fetch('/api/referrals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId,
          action: 'ACCEPT',
          notes: 'Accepted by St. Jude Community Clinic Triage desk.',
        }),
      });
      if (res.ok) {
        fetchReferrals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordClinicalDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admittingRef || !clinicalNotes.trim()) return;

    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId: admittingRef.id,
          serviceType: 'Acute Clinical Care & Medical Stabilization',
          evidenceNotes: clinicalNotes,
          locationNotes: facilityLocus,
        }),
      });

      if (res.ok) {
        setFeedbackMsg('Clinical treatment recorded & proof entered into shared verification ledger!');
        setAdmittingRef(null);
        setClinicalNotes('');
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
              Hospital Clinical Desk
            </h1>
            <span className="rounded-full bg-[#E8F3F0] border border-[#176B67]/30 px-3 py-1 text-xs font-mono font-bold text-[#176B67]">
              CLINICAL TRIAGE
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Acute medical referral intake, confidential trauma stabilization, and verifiable clinical proofs.
          </p>
        </div>

        <button
          onClick={fetchReferrals}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-mono font-semibold text-[#182536] hover:bg-[#F5F3EC] border border-[#E4E8E5] shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#176B67]' : 'text-[#64748B]'}`} />
          <span>Sync Clinical Desk</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-[#E8F3F0] border border-[#176B67]/30 text-[#21845A] text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#21845A] shrink-0" />
            <span>{feedbackMsg}</span>
          </span>
          <button onClick={() => setFeedbackMsg('')} className="text-[#64748B] hover:text-[#182536]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats and 3D Clinical Pathway Preview */}
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 bg-white p-7 rounded-3xl border border-[#E4E8E5] shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#176B67] uppercase font-bold block mb-1">
                St. Jude Metropolitan Health System
              </span>
              <h3 className="text-xl font-bold text-[#182536] tracking-tight">Clinical Bed Status</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setMedicalBeds((prev) => ({
                    ...prev,
                    available: Math.max(0, prev.available - 1),
                  }))
                }
                className="w-9 h-9 rounded-xl bg-[#F5F3EC] border border-[#E4E8E5] flex items-center justify-center text-[#182536] hover:bg-white hover:border-[#C94C4C] transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setMedicalBeds((prev) => ({
                    ...prev,
                    available: Math.min(prev.total, prev.available + 1),
                  }))
                }
                className="w-9 h-9 rounded-xl bg-[#F5F3EC] border border-[#E4E8E5] flex items-center justify-center text-[#182536] hover:bg-white hover:border-[#176B67] transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5]">
              <span className="text-[11px] font-mono text-[#64748B] block mb-1">Available Medical Beds</span>
              <div className="text-3xl font-mono font-black text-[#176B67]">{medicalBeds.available}</div>
              <div className="text-[10px] font-mono text-[#176B67] mt-1 font-semibold">Acute care ready</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5]">
              <span className="text-[11px] font-mono text-[#64748B] block mb-1">Admitted Patients</span>
              <div className="text-3xl font-mono font-black text-[#101D32]">
                {medicalBeds.total - medicalBeds.available}
              </div>
              <div className="text-[10px] font-mono text-[#64748B] mt-1">Under clinical stabilization</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5]">
              <span className="text-[11px] font-mono text-[#64748B] block mb-1">Total Dedicated Beds</span>
              <div className="text-3xl font-mono font-black text-[#D8B77A]">{medicalBeds.total}</div>
              <div className="text-[10px] font-mono text-[#64748B] mt-1">Pavilion B Social Quota</div>
            </div>
          </div>
        </div>

        {/* 3D Gallery Tunnel Mini Widget in Midnight Navy Container */}
        <div className="lg:col-span-4 bg-[#101D32] text-white p-6 rounded-3xl border border-[#176B67]/30 shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-[#F5F3EC]/80 z-10">
            <span className="text-white font-bold">CLINICAL DISPATCH STREAM</span>
            <span className="text-[#35A99A] font-bold">ACTIVE</span>
          </div>

          <div className="h-[150px] w-full rounded-2xl overflow-hidden relative my-2">
            <GalleryTunnel speedMultiplier={0.65} interactive={false} variant="compact" />
          </div>

          <div className="z-10 text-[10px] font-mono text-[#F5F3EC]/80 flex items-center justify-between">
            <span>HIPAA-Aligned Relays</span>
            <span className="text-[#35A99A] font-bold">ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* Referrals Queue Table */}
      <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#182536] tracking-tight">Acute Healthcare Referrals</h3>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Medical assistance requests originating from field outreach and shelter teams.
            </p>
          </div>
          <span className="text-xs font-mono text-[#176B67] font-semibold">
            {referrals.length} Cases
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E4E8E5]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F5F3EC] text-[#64748B] border-b border-[#E4E8E5]">
              <tr>
                <th className="px-5 py-3.5">Patient / Case</th>
                <th className="px-5 py-3.5">Clinical Need</th>
                <th className="px-5 py-3.5">Urgency</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E8E5]">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#64748B]">
                    No medical referrals currently pending clinical triage.
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
                            : 'bg-amber-50 text-[#D49A35] border border-amber-200'
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F3EC] border border-[#E4E8E5] text-[#182536] text-[10px] font-semibold">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {r.status === 'PENDING' && (
                        <button
                          onClick={() => handleAccept(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#176B67] hover:bg-[#125855] text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Accept Triage
                        </button>
                      )}

                      {r.status === 'ACCEPTED' && (
                        <button
                          onClick={() => setAdmittingRef(r)}
                          className="px-3 py-1.5 rounded-lg bg-[#E8F3F0] hover:bg-[#d6eae5] text-[#176B67] border border-[#176B67]/30 text-xs font-bold transition-all"
                        >
                          Log Clinical Proof
                        </button>
                      )}

                      {r.status !== 'PENDING' && r.status !== 'ACCEPTED' && (
                        <span className="text-[11px] text-[#64748B]">Intake Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Delivery Modal (Pure White Card) */}
      {admittingRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D32]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full p-7 rounded-3xl border border-[#E4E8E5] shadow-2xl space-y-5 text-[#182536]">
            <div className="flex items-center justify-between border-b border-[#E4E8E5] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#182536] tracking-tight">Record Clinical Delivery</h3>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Confirm medical service delivery for {admittingRef.case?.individual?.firstName}.
                </p>
              </div>
              <button onClick={() => setAdmittingRef(null)} className="text-[#64748B] hover:text-[#182536]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordClinicalDelivery} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                  Clinical Ward / Clinic Unit
                </label>
                <input
                  type="text"
                  required
                  value={facilityLocus}
                  onChange={(e) => setFacilityLocus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                  Clinical Treatment Proof &amp; Regimen Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Wound cleaned & dressed; prescribed antibiotic regimen; scheduled follow-up..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] font-sans resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#E8F3F0] border border-[#176B67]/20 text-[11px] text-[#176B67] font-mono">
                NOTICE: Case shifts to PENDING_VERIFICATION. Independent Case Manager sign-off required.
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
                  Certify Medical Proof
                </PremiumButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
