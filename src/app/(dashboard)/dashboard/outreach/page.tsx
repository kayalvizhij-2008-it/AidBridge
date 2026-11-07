'use client';

import React, { useState, useEffect } from 'react';
import {
  HandHeart,
  Plus,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Wifi,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
  X,
} from 'lucide-react';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface CaseItem {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  priority: string;
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
  }>;
}

export default function OutreachDashboardPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRegistering, setIsRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Field Registration Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ageCategory: 'ADULT',
    approximateAge: '',
    gender: 'Undisclosed',
    contactPhone: '',
    currentLocus: '',
    consentGiven: true,
    consentNotes: 'Verbal consent obtained in field presence.',
    safeguardingFlags: '',
    caseTitle: '',
    priority: 'HIGH',
    needsCategory: 'EMERGENCY_SHELTER',
    needsUrgency: 'HIGH',
    needsNotes: '',
  });

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          ageCategory: formData.ageCategory,
          approximateAge: formData.approximateAge ? parseInt(formData.approximateAge) : undefined,
          gender: formData.gender,
          contactPhone: formData.contactPhone,
          currentLocus: formData.currentLocus,
          consentGiven: formData.consentGiven,
          consentNotes: formData.consentNotes,
          safeguardingFlags: formData.safeguardingFlags,
          title: formData.caseTitle || `Street Intake: ${formData.firstName} ${formData.lastName}`,
          priority: formData.priority,
          needs: [
            {
              category: formData.needsCategory,
              urgency: formData.needsUrgency,
              notes: formData.needsNotes,
            },
          ],
        }),
      });

      if (res.ok) {
        setSuccessMsg('Individual intake registered & case opened on shared ledger!');
        setIsRegistering(false);
        fetchCases();
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          ageCategory: 'ADULT',
          approximateAge: '',
          gender: 'Undisclosed',
          contactPhone: '',
          currentLocus: '',
          consentGiven: true,
          consentNotes: 'Verbal consent obtained in field presence.',
          safeguardingFlags: '',
          caseTitle: '',
          priority: 'HIGH',
          needsCategory: 'EMERGENCY_SHELTER',
          needsUrgency: 'HIGH',
          needsNotes: '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      `${c.individual.firstName} ${c.individual.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      (c.individual.currentLocus && c.individual.currentLocus.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in text-[#182536]">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#182536]">
              Outreach Field Desk
            </h1>
            <span className="rounded-full bg-[#E8F3F0] border border-[#176B67]/30 px-3 py-1 text-xs font-mono font-bold text-[#176B67]">
              TRIAGE DESK
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Street encounter intake, multi-domain vulnerability assessment, and instant bed dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PremiumButton
            onClick={() => setIsRegistering(true)}
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            New Street Intake
          </PremiumButton>

          <button
            onClick={fetchCases}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-[#E4E8E5] hover:bg-[#F5F3EC] text-[#182536] shadow-sm transition-all"
            title="Refresh Caseload"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#176B67]' : 'text-[#64748B]'}`} />
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#E8F3F0] border border-[#176B67]/30 text-[#21845A] text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#21845A]" />
            <span>{successMsg}</span>
          </span>
          <button onClick={() => setSuccessMsg('')} className="text-[#64748B] hover:text-[#182536]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Banner with Gallery Tunnel Corridor Preview */}
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 grid gap-4 sm:grid-cols-3">
          <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] shadow-card">
            <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">Field Caseload</span>
            <div className="text-2xl font-mono font-extrabold text-[#101D32]">{cases.length}</div>
            <div className="text-[10px] font-mono text-[#176B67] mt-1 font-semibold">Logged street encounters</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] shadow-card">
            <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">High / Critical Urgency</span>
            <div className="text-2xl font-mono font-extrabold text-[#C94C4C]">
              {cases.filter((c) => c.priority === 'CRITICAL' || c.priority === 'HIGH').length}
            </div>
            <div className="text-[10px] font-mono text-[#C94C4C] mt-1">Priority dispatch active</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] shadow-card">
            <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">Active Referrals</span>
            <div className="text-2xl font-mono font-extrabold text-[#21845A]">
              {cases.reduce((acc, c) => acc + (c.referrals?.length || 0), 0)}
            </div>
            <div className="text-[10px] font-mono text-[#21845A] mt-1">Dispatched to providers</div>
          </div>
        </div>

        {/* Compact 3D Gallery Tunnel Widget in Midnight Navy Container */}
        <div className="lg:col-span-4 bg-[#101D32] p-4 rounded-2xl border border-[#176B67]/30 shadow-card flex flex-col justify-between relative overflow-hidden h-[130px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F3EC]/80 z-10">
            <span>ASSISTANCE CORRIDOR</span>
            <span className="text-[#35A99A] font-bold">STREAMING</span>
          </div>
          <div className="absolute inset-0 top-6 rounded-xl overflow-hidden opacity-85">
            <GalleryTunnel speedMultiplier={0.6} interactive={false} variant="compact" />
          </div>
        </div>
      </div>

      {/* Caseload Search & Filters on Pure White Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E4E8E5] shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search case #, individual name, or locus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F5F3EC] border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-xs focus:outline-none focus:border-[#176B67] focus:bg-white font-sans transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'OPEN', 'REFERRED', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'CLOSED'].map((st) => (
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

        {/* Cases Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#E4E8E5]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F5F3EC] text-[#64748B] border-b border-[#E4E8E5]">
              <tr>
                <th className="px-5 py-3.5">Case / Individual</th>
                <th className="px-5 py-3.5">Locus &amp; Age</th>
                <th className="px-5 py-3.5">Needs Assessment</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Referrals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E8E5]">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#64748B]">
                    <FolderOpen className="w-8 h-8 text-[#64748B]/40 mx-auto mb-2" />
                    <span>No cases match current filter criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F5F3EC]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#182536] font-sans text-sm">
                        {c.individual.firstName} {c.individual.lastName}
                      </div>
                      <div className="text-[#176B67] text-[11px] font-semibold">{c.caseNumber}</div>
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">
                      <div className="flex items-center gap-1 text-[11px] text-[#182536]">
                        <MapPin className="w-3 h-3 text-[#176B67]" />
                        <span>{c.individual.currentLocus || 'Field Encounter'}</span>
                      </div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">
                        {c.individual.ageCategory} {c.individual.approximateAge ? `(~${c.individual.approximateAge} yrs)` : ''}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {c.needsAssessments && c.needsAssessments.length > 0 ? (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-[#E8F3F0] border border-[#176B67]/30 text-[#176B67] text-[10px] font-bold">
                            {c.needsAssessments[0].category.replace('_', ' ')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#64748B]">None logged</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'CRITICAL'
                            ? 'bg-rose-50 text-[#C94C4C] border border-rose-200'
                            : c.priority === 'HIGH'
                            ? 'bg-amber-50 text-[#D49A35] border border-amber-200'
                            : 'bg-[#E8F3F0] text-[#176B67] border border-[#176B67]/20'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F3EC] border border-[#E4E8E5] text-[#182536] text-[10px] font-semibold">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-[#101D32]">
                        {c.referrals?.length || 0} active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal Dialog (Pure White Card with Proper Contrast) */}
      {isRegistering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D32]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-2xl w-full p-7 rounded-3xl border border-[#E4E8E5] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E4E8E5] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#182536] tracking-tight">New Street Intake Registration</h3>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Radical data minimization: verbal consent, zero state ID friction.
                </p>
              </div>
              <button
                onClick={() => setIsRegistering(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#182536]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                    First Name / Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                    Last Name / Moniker *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                    Age Bracket
                  </label>
                  <select
                    value={formData.ageCategory}
                    onChange={(e) => setFormData({ ...formData, ageCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                  >
                    <option value="ADULT">Adult (18-59)</option>
                    <option value="ELDERLY">Senior / Elderly (60+)</option>
                    <option value="YOUTH">Transitional Youth</option>
                    <option value="CHILD">Unaccompanied Minor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                    Approximate Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={formData.approximateAge}
                    onChange={(e) => setFormData({ ...formData, approximateAge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Undisclosed">Undisclosed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                  Encounter Location / Locus *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North District Metro Station Bench 4"
                  value={formData.currentLocus}
                  onChange={(e) => setFormData({ ...formData, currentLocus: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                    Primary Immediate Need
                  </label>
                  <select
                    value={formData.needsCategory}
                    onChange={(e) => setFormData({ ...formData, needsCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                  >
                    <option value="EMERGENCY_SHELTER">Emergency Sanctuary Bed</option>
                    <option value="FOOD_NUTRITION">Nutritional Meal Rations</option>
                    <option value="MEDICAL_ASSISTANCE">Acute Clinical Healthcare</option>
                    <option value="CHILD_PROTECTION">Child / Youth Protection</option>
                    <option value="ELDERLY_CARE">Geriatric Mobility &amp; Respite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                    Urgency Tier
                  </label>
                  <select
                    value={formData.needsUrgency}
                    onChange={(e) => setFormData({ ...formData, needsUrgency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans"
                  >
                    <option value="CRITICAL">Critical (Immediate life hazard)</option>
                    <option value="HIGH">High (Urgent same-day shelter)</option>
                    <option value="MEDIUM">Medium (Stable overnight)</option>
                    <option value="LOW">Low (Scheduled maintenance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#182536] uppercase mb-1 font-semibold">
                  Safeguarding &amp; Field Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Note weather exposure, mobility limitations, medical conditions, or trauma indicators..."
                  value={formData.needsNotes}
                  onChange={(e) => setFormData({ ...formData, needsNotes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-xs focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] font-sans resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#182536]"
                >
                  Cancel
                </button>
                <PremiumButton
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={submitting}
                  withArrow
                >
                  Confirm &amp; Open Case
                </PremiumButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
