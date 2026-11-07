'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Compass,
  Home as HomeIcon,
  HeartPulse,
  Users,
  FileCheck2,
} from 'lucide-react';
import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { BlackHole } from '@/components/3d/BlackHole';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    jurisdiction: 'Metro Ward 1-4',
    roleRequested: 'ROLE_OUTREACH',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative selection:bg-[#35A99A]/20 selection:text-[#101D32]">
      <BrandNavbar />

      {/* Midnight Navy Header Banner */}
      <section className="bg-[#101D32] text-white py-14 sm:py-16 relative overflow-hidden border-b border-[#E4E8E5]/10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[#176B67]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#182B49] px-4 py-1.5 text-xs font-mono text-[#35A99A] border border-[#35A99A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B77A]" />
            <span>AGENCY ACCREDITATION &amp; CREDENTIALING</span>
          </div>

          <AnimatedHeading
            as="h1"
            mode="word"
            text="Join the Verified Care Network"
            highlightWords={['Verified', 'Care', 'Network']}
            highlightClass="text-[#35A99A]"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
          />

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#F5F3EC]/80 leading-relaxed">
            Municipal authorities, licensed emergency shelters, street outreach NGOs, and hospital
            health systems can request operational desk credentials or evaluate demonstration desks immediately.
          </p>
        </div>
      </section>

      {/* Main Form + 3D Visual Section on Warm Ivory */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Form on Pure White Card */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E8E5] shadow-card">
                {submitted ? (
                  <div className="flex flex-col items-center py-10 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#E8F3F0] border border-[#176B67]/30 flex items-center justify-center text-[#21845A]">
                      <CheckCircle2 className="h-8 w-8 text-[#21845A]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#182536]">Access Request Recorded</h3>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md">
                      Your inquiry for <strong className="text-[#182536]">{form.organisation || 'your agency'}</strong> has
                      been queued for municipal credentialing verification. You can evaluate the live
                      platform immediately using pre-configured demonstration desks.
                    </p>
                    <div className="pt-3">
                      <PremiumButton href="/login" variant="primary" size="md" withArrow>
                        Evaluate Live Desks Now
                      </PremiumButton>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="border-b border-[#E4E8E5] pb-4 mb-2">
                      <h2 className="text-xl font-bold text-[#182536]">Institutional Access Application</h2>
                      <p className="text-xs text-[#64748B] mt-1">
                        Submit authorized agency details. Approvals are tied to cryptographic role privileges.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                        >
                          Representative Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          placeholder="e.g. Director Elena Vance"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                        >
                          Institutional Work Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          placeholder="name@agency.gov or name@ngo.org"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="org"
                          className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                        >
                          Agency or Organisation Name *
                        </label>
                        <input
                          id="org"
                          type="text"
                          required
                          placeholder="e.g. Hope Haven Sanctuary"
                          value={form.organisation}
                          onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="jurisdiction"
                          className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                        >
                          Municipal Ward or Sector *
                        </label>
                        <input
                          id="jurisdiction"
                          type="text"
                          required
                          placeholder="e.g. District 1 Core & Transit"
                          value={form.jurisdiction}
                          onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="role"
                        className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                      >
                        Requested Operational Desk *
                      </label>
                      <select
                        id="role"
                        value={form.roleRequested}
                        onChange={(e) => setForm({ ...form, roleRequested: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                      >
                        <option value="ROLE_OUTREACH">Outreach Field Worker (Street Intake & Triage)</option>
                        <option value="ROLE_SHELTER">Shelter Coordinator (Bed Sanctuary Roster)</option>
                        <option value="ROLE_HOSPITAL">Hospital Coordinator (Clinical Healthcare)</option>
                        <option value="ROLE_MANAGER">Case Manager (Verification & Guarded Closure)</option>
                        <option value="ROLE_ADMIN">Government Administrator (Policy & Audit)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                      >
                        Operational Capacity Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        placeholder="Detail bed capacities, medical clinical specialties, or outreach van teams..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans resize-none"
                      />
                    </div>

                    <PremiumButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      withArrow
                      className="w-full"
                    >
                      Submit Credential Request
                    </PremiumButton>

                    <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#64748B]">
                      <span>Already authorized?</span>
                      <Link href="/login" className="text-[#176B67] font-semibold hover:underline">
                        Sign in to Workspace &rarr;
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Contained 3D Visual Panel (Black Hole Ecosystem in Midnight Navy container) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="h-[480px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#176B67]/30 shadow-card relative">
                <BlackHole
                  particleCount={2800}
                  size={1}
                  interactive={true}
                  showTelemetry={true}
                  accentTitle="CARE ECOSYSTEM ACCREDITATION"
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] shadow-sm text-xs font-mono text-[#64748B] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#176B67]" />
                  GOVTECH CERTIFIED ONBOARDING
                </span>
                <span className="text-[#176B67] font-bold">ZERO ID FRICTION</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BrandFooter />
    </div>
  );
}
