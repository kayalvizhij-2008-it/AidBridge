'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Activity,
  CheckCircle2,
  ShieldAlert,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  BarChart3,
  Clock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { BlackHole } from '@/components/3d/BlackHole';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';

export default function ImpactPage() {
  const [selectedMetric, setSelectedMetric] = useState(0);

  const STATS = [
    {
      label: 'Registered Beneficiaries',
      value: '47,128',
      sub: 'Active municipal registry caseload',
      icon: <Users className="h-5 w-5 text-[#176B67]" />,
      color: 'text-[#176B67]',
      change: '+12.4% vs last quarter',
    },
    {
      label: 'Active Care Cases',
      value: '3,128',
      sub: 'Across 5 urban municipal wards',
      icon: <Activity className="h-5 w-5 text-[#35A99A]" />,
      color: 'text-[#35A99A]',
      change: '100% capacity-matched',
    },
    {
      label: 'Verified Physical Deliveries',
      value: '2,906',
      sub: 'Physical assistance confirmed with evidence',
      icon: <CheckCircle2 className="h-5 w-5 text-[#21845A]" />,
      color: 'text-[#21845A]',
      change: '92.9% verification rate',
    },
    {
      label: 'Pending Dual-Key Signoffs',
      value: '74',
      sub: 'Awaiting independent manager review',
      icon: <ShieldAlert className="h-5 w-5 text-[#D49A35]" />,
      color: 'text-[#D49A35]',
      change: 'Avg. review 4.2 hours',
    },
  ];

  const AUDIT_MILESTONES = [
    {
      step: '01',
      title: 'Individual Intake Registered',
      sub: 'Minimum necessary data captured with explicit safeguarding flags and verbal consent.',
      actor: 'Outreach Worker',
      time: 'T+0h',
    },
    {
      step: '02',
      title: 'Needs Diagnostic Scored',
      sub: 'Standardized severity rating across 6 assistance domains: Critical, High, Medium, or Low.',
      actor: 'Field Caseworker',
      time: 'T+15m',
    },
    {
      step: '03',
      title: 'Referral Dispatched to Provider',
      sub: 'Capacity-locked reservation to certified shelter, medical clinic, or food depot.',
      actor: 'Referral Engine',
      time: 'T+25m',
    },
    {
      step: '04',
      title: 'Provider Acceptance or Rejection Logged',
      sub: 'Turn-aways require a documented, audited justification. No dropped paper notes.',
      actor: 'Provider Coordinator',
      time: 'T+1h',
    },
    {
      step: '05',
      title: 'Service Delivery Physical Proof Logged',
      sub: 'Physical admission or ration distribution logged with timestamp and evidence receipt.',
      actor: 'Intake Staff',
      time: 'T+3h',
    },
    {
      step: '06',
      title: 'Independent Verification Completed',
      sub: 'Authorized Case Manager independently signs the dual-key verification ledger.',
      actor: 'Case Manager',
      time: 'T+12h',
    },
    {
      step: '07',
      title: 'Case Safely Closed & 30-Day Follow-Up',
      sub: 'Zero cases may close before verification conditions are certified in the ledger.',
      actor: 'Liaison Desk',
      time: 'T+30d',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative">
      <BrandNavbar />

      <main className="flex-1">
        {/* 1. Header Section in Midnight Navy with Synthetic Demonstration Disclaimer */}
        <section className="bg-[#101D32] text-white pt-12 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10 space-y-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#182B49] px-4 py-1.5 text-xs font-mono text-[#35A99A] border border-[#35A99A]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B77A]" />
                <span>TRANSPARENCY &amp; OUTCOME PROVENANCE</span>
              </div>

              <AnimatedHeading
                as="h1"
                mode="word"
                text="Auditable Accountability Across Every Case"
                highlightWords={['Auditable', 'Accountability', 'Every', 'Case']}
                highlightClass="text-[#35A99A] font-extrabold"
                className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
              />

              <p className="text-sm sm:text-base text-[#F5F3EC]/80 leading-relaxed max-w-2xl mx-auto">
                AidBridge provides unalterable transparency into social care delivery. All metrics
                below reflect synthetic demonstration data created to illustrate verifiable care integrity.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B77A]/15 border border-[#D8B77A]/30 text-[#D8B77A] text-xs font-mono">
                <span>DEMONSTRATION SYSTEM: SYNTHETIC DATA FOR EVALUATION PURPOSES</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key KPI Stats Grid on Pure White Cards */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl space-y-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  onClick={() => setSelectedMetric(idx)}
                  className={`bg-white p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    selectedMetric === idx
                      ? 'border-[#176B67] shadow-card-elevated ring-1 ring-[#176B67]/30'
                      : 'border-[#E4E8E5] hover:border-[#176B67]/40 shadow-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#E8F3F0] flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <Badge variant="champagne" className="text-[10px]">
                      SYNTHETIC DEMO
                    </Badge>
                  </div>

                  <div className={`text-3xl font-mono font-bold ${stat.color} mb-1 tracking-tight`}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-[#182536] mb-0.5">{stat.label}</div>
                  <div className="text-[11px] text-[#64748B] mb-3">{stat.sub}</div>

                  <div className="pt-3 border-t border-[#E4E8E5] text-[11px] font-mono text-[#21845A] flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D Black Hole Data Convergence Visual Section */}
            <div className="bg-[#101D32] text-white p-8 sm:p-12 rounded-3xl border border-[#E4E8E5]/20 shadow-xl">
              <div className="grid gap-10 lg:grid-cols-12 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#182B49] px-3.5 py-1 text-xs font-mono text-[#35A99A] border border-[#35A99A]/40">
                    <BarChart3 className="w-3.5 h-3.5 text-[#35A99A]" />
                    <span>MUNICIPAL DATA HARMONIZATION</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Zero Data Leakage Across Agencies
                  </h3>

                  <p className="text-sm text-[#F5F3EC]/80 leading-relaxed font-normal">
                    The 3D particle orbit represents data flows from five disparate agency
                    silos harmonized into a single cryptographic verification ledger without exposing
                    sensitive personal identities.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F5F3EC]/70">Turn-Away Audit Logging:</span>
                      <span className="text-[#35A99A] font-bold">100% Documented</span>
                    </div>
                    <div className="w-full bg-[#182B49] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#176B67] h-full w-full" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <PremiumButton href="/login" variant="primary" size="md" withArrow>
                      Inspect Audit Ledgers in Admin
                    </PremiumButton>
                  </div>
                </div>

                {/* Black Hole 3D canvas */}
                <div className="lg:col-span-7 h-[420px] rounded-2xl overflow-hidden bg-[#182B49] border border-white/10 relative">
                  <BlackHole
                    particleCount={2800}
                    size={1.05}
                    interactive={true}
                    showTelemetry={true}
                    accentTitle="AUDIT VORTEX // SYNCHRONIZED SECTOR FEEDS"
                  />
                </div>
              </div>
            </div>

            {/* Seven Provenance Milestones */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E8E5] shadow-card">
              <div className="max-w-2xl mb-8">
                <div className="flex items-center gap-2.5 mb-2">
                  <FileCheck className="h-6 w-6 text-[#176B67]" />
                  <h3 className="text-xl sm:text-2xl font-bold text-[#182536] tracking-tight">
                    The Seven Provenance Milestones
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  How an intervention moves from street encounter to verified closure without dropped
                  handoffs or unconfirmed statuses.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AUDIT_MILESTONES.map((item) => (
                  <div
                    key={item.step}
                    className="p-5 rounded-2xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-2 hover:border-[#176B67]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#176B67] text-white font-mono text-xs font-bold">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] font-semibold">{item.time}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#182536] tracking-tight">{item.title}</h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.sub}</p>

                    <div className="pt-2 text-[10px] font-mono text-[#176B67] flex items-center justify-between font-bold">
                      <span>ROLE: {item.actor}</span>
                      <span className="text-[#21845A]">LEDGER LOGGED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Tunnel Assistance Delivery Corridor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                    VERIFIED PROTOCOLS
                  </span>
                  <h3 className="text-2xl font-bold text-[#182536] tracking-tight">
                    Assistance Delivery Corridor
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#64748B]">
                  ACTIVE MUNICIPAL SERVICES
                </span>
              </div>

              <div className="h-[360px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 shadow-xl relative">
                <GalleryTunnel speedMultiplier={0.7} interactive={true} variant="compact" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
