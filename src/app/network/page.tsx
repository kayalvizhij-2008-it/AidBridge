'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Users,
  ShieldCheck,
  HeartPulse,
  Home as HomeIcon,
  ArrowRight,
  Sparkles,
  Lock,
  Activity,
  Layers,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { BlackHole } from '@/components/3d/BlackHole';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';

const STAKEHOLDERS = [
  {
    name: 'Government Administrator',
    role: 'Municipal Policy & Oversight',
    desc: 'Manages municipal departments, authorized user accounts, system-wide capacity analytics, cryptographic audit logs, and compliance reporting across all jurisdictions.',
    icon: <ShieldCheck className="h-6 w-6 text-[#176B67]" />,
    tag: 'GOVTECH POLICY',
    route: '/dashboard/admin',
    account: 'admin@aidbridge.local',
    metric: '99.8% Audit Compliance',
    stat: '5 Wards Overseen',
  },
  {
    name: 'Outreach Field Worker',
    role: 'Street Intake & Triage',
    desc: 'Registers vulnerable individuals in the field with minimal consent, conducts immediate needs assessments, flags safeguarding risks, and reserves live shelter beds.',
    icon: <Compass className="h-6 w-6 text-[#176B67]" />,
    tag: 'FIELD TRIAGE',
    route: '/dashboard/outreach',
    account: 'outreach@aidbridge.local',
    metric: '4 min Street Intake',
    stat: 'Real-Time GPS Sync',
  },
  {
    name: 'Shelter Coordinator',
    role: 'Sanctuary Roster & Bed Inventory',
    desc: 'Monitors real-time emergency bed capacity, manages incoming shelter referrals, logs physical check-ins with intake timestamps, and tracks critical resource shortages.',
    icon: <HomeIcon className="h-6 w-6 text-[#176B67]" />,
    tag: 'SANCTUARY ROSTER',
    route: '/dashboard/shelter',
    account: 'shelter@aidbridge.local',
    metric: '18 Available Beds',
    stat: 'Live Quota Management',
  },
  {
    name: 'Hospital Coordinator',
    role: 'Acute Clinical Care & Triage',
    desc: 'Receives acute healthcare referrals, reviews medical assistance requirements, coordinates clinical triage, and verifies clinical medical delivery.',
    icon: <HeartPulse className="h-6 w-6 text-[#176B67]" />,
    tag: 'CLINICAL CARE',
    route: '/dashboard/hospital',
    account: 'hospital@aidbridge.local',
    metric: '100% Intake Proof',
    stat: 'HIPAA & Safeguard Compliance',
  },
  {
    name: 'Case Manager',
    role: 'Trajectory & Verification Desk',
    desc: 'Oversees the entire individual trajectory, coordinates multi-agency providers, monitors overdue interventions, verifies delivery, and executes guarded closure.',
    icon: <Users className="h-6 w-6 text-[#176B67]" />,
    tag: 'CASE STEWARDSHIP',
    route: '/dashboard/manager',
    account: 'manager@aidbridge.local',
    metric: 'Guarded Closure Gate',
    stat: 'Dual-Key Verification',
  },
];

export default function NetworkPage() {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative">
      <BrandNavbar />

      <main className="flex-1">
        {/* 1. Header Section in Midnight Navy with Connected Ecosystem Centerpiece */}
        <section className="bg-[#101D32] text-white pt-12 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10 space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#182B49] px-4 py-1.5 text-xs font-mono text-[#35A99A] border border-[#35A99A]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B77A]" />
                <span>STAKEHOLDER ECOSYSTEM MATRIX</span>
              </div>

              <AnimatedHeading
                as="h1"
                mode="word"
                text="Five Desks. One Unbroken Continuum."
                highlightWords={['Five', 'Desks.', 'Unbroken']}
                highlightClass="text-[#35A99A] font-extrabold"
                className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
              />

              <p className="text-sm sm:text-base text-[#F5F3EC]/80 leading-relaxed max-w-2xl mx-auto">
                AidBridge breaks institutional barriers by connecting municipal agencies, street
                outreach teams, emergency shelters, and healthcare providers into one synchronized,
                accountable safety net.
              </p>
            </div>

            {/* Central 3D Visual: Colourful Black Hole as Connected Support Ecosystem */}
            <div className="bg-[#182B49] p-8 sm:p-12 rounded-3xl border border-[#D8B77A]/30 shadow-xl">
              <div className="grid gap-10 lg:grid-cols-12 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#176B67]/30 px-3 py-1 text-xs font-mono text-[#35A99A] border border-[#35A99A]/40">
                    <Activity className="w-3.5 h-3.5 text-[#35A99A]" />
                    <span>CARE EQUILIBRIUM ARCHITECTURE</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    The Connected Support Ecosystem
                  </h3>

                  <p className="text-sm text-[#F5F3EC]/80 leading-relaxed">
                    In our architecture, the 3D particle swirl represents live referrals,
                    shelter bed reserves, and clinical handovers rotating in synchronized harmony
                    around the central beneficiary.
                  </p>

                  <p className="text-sm text-[#F5F3EC]/80 leading-relaxed">
                    No individual is allowed to slip away into an untracked void: every agency holds
                    mutual accountability on the shared verification ledger.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <PremiumButton href="/login" variant="primary" size="md" withArrow>
                      Launch Live Desks
                    </PremiumButton>
                    <PremiumButton
                      href="/how-it-works"
                      variant="outline"
                      size="md"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      Review Protocols
                    </PremiumButton>
                  </div>
                </div>

                {/* 3D Black Hole Animation */}
                <div className="lg:col-span-7 h-[400px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#101D32] border border-white/10 relative">
                  <BlackHole
                    particleCount={2800}
                    size={1.05}
                    interactive={true}
                    showTelemetry={true}
                    accentTitle="CARE ORBIT // 5 PARTICIPATING SECTORS"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Stakeholder Workspaces Grid in Pure White Cards on Warm Ivory */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                  MUNICIPAL ROLES
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                  Role Workspaces &amp; Responsibilities
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                SELECT A DESK TO INSPECT
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {STAKEHOLDERS.map((s, idx) => (
                <div
                  key={s.name}
                  onClick={() => setActiveRole(idx)}
                  className={`bg-white p-7 rounded-2xl border transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                    activeRole === idx
                      ? 'border-[#176B67] shadow-card-elevated ring-1 ring-[#176B67]/30'
                      : 'border-[#E4E8E5] hover:border-[#176B67]/40 shadow-card'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#E8F3F0] flex items-center justify-center group-hover:bg-[#176B67] transition-colors">
                        <span className="group-hover:text-white transition-colors">{s.icon}</span>
                      </div>
                      <Badge variant="champagne" className="text-[10px]">
                        {s.tag}
                      </Badge>
                    </div>

                    <h4 className="text-lg font-bold text-[#182536] group-hover:text-[#176B67] transition-colors mb-1">
                      {s.name}
                    </h4>
                    <p className="text-xs font-mono text-[#176B67] mb-3">{s.role}</p>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#E4E8E5] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#64748B]">Performance Metric:</span>
                      <span className="text-[#176B67] font-bold">{s.metric}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#64748B]">Authorized Role:</span>
                      <span className="text-[#182536] font-semibold">{s.account}</span>
                    </div>

                    <Link
                      href="/login"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5F3EC] hover:bg-[#E8F3F0] border border-[#E4E8E5] hover:border-[#176B67]/40 py-2.5 text-xs font-mono font-bold text-[#182536] transition-all"
                    >
                      <span>Launch Role Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#176B67]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Cross-Agency Assistance Relay (Gallery Tunnel) */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E4E8E5]">
          <div className="container mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                  REAL-TIME PIPELINE
                </span>
                <h3 className="text-2xl font-bold text-[#182536] tracking-tight">
                  Cross-Agency Assistance Relay
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                Active Data Pipeline
              </span>
            </div>

            <div className="h-[360px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 shadow-xl relative">
              <GalleryTunnel speedMultiplier={0.7} interactive={true} variant="compact" />
            </div>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
