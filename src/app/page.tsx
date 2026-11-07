'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  HeartPulse,
  Home as HomeIcon,
  Users,
  Compass,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  Zap,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  ShieldAlert,
  MapPin,
} from 'lucide-react';

import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { HeroEcosystemConstellation } from '@/components/landing/HeroEcosystemConstellation';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { Marquee } from '@/components/motion/Marquee';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';
import { ServiceNetworkMap } from '@/components/map/ServiceNetworkMap';

const WORKFLOW_STAGES = [
  {
    step: '01',
    title: 'Identify',
    subtitle: 'Street Intake & Safe Registry',
    desc: 'Outreach teams meet individuals in transit hubs and streets, recording minimal consent-driven identifiers without requiring state IDs.',
    tag: 'FIELD TRIAGE',
    actor: 'Outreach Worker',
    evidence: 'Verbal consent, GPS vicinity, immediate safeguarding flags',
  },
  {
    step: '02',
    title: 'Assess',
    subtitle: 'Multi-Domain Needs Matrix',
    desc: 'Instant diagnostic matrix scoring urgent shelter, nutritional deficit, clinical vulnerability, and physical safeguarding requirements.',
    tag: 'PRIORITY SCORING',
    actor: 'Field Worker / Case Manager',
    evidence: 'Urgency tier (Critical, High, Medium, Low), multi-category assessment',
  },
  {
    step: '03',
    title: 'Connect',
    subtitle: 'Capacity-Aware Referral',
    desc: 'Direct dispatch to verified shelters and acute healthcare clinics based on live bed counts and real-time intake quotas.',
    tag: 'DIRECT ROUTING',
    actor: 'Referral Engine / Caseworker',
    evidence: 'Target provider selected, live capacity reservation, mandatory turn-away logging',
  },
  {
    step: '04',
    title: 'Deliver',
    subtitle: 'Physical Aid Handover',
    desc: 'Service providers record tangible intake (e.g., bed allocated, clinical evaluation, emergency rations) with mandatory evidence logging.',
    tag: 'EVIDENCE CAPTURE',
    actor: 'Shelter / Hospital Coordinator',
    evidence: 'Physical intake receipt, bed #, medical chart ID, timestamped proof',
  },
  {
    step: '05',
    title: 'Verify',
    subtitle: 'Dual-Key Case Sign-Off',
    desc: 'Case managers independently review delivery proof before certifying assistance. Cases cannot be closed merely on referral creation.',
    tag: 'INDEPENDENT AUDIT',
    actor: 'Authorized Case Manager',
    evidence: 'Independent cross-verification, audit ledger entry, closure authorization',
  },
  {
    step: '06',
    title: 'Follow Up',
    subtitle: 'Long-Term Stabilization',
    desc: 'Structured 14-day and 30-day touchpoints track permanent housing, medical adherence, and municipal welfare stabilization.',
    tag: 'STABILIZATION',
    actor: 'Case Manager & Social Worker',
    evidence: '14-day & 30-day scheduled checks, outcome record, recidivism prevention',
  },
];

const PROBLEM_POINTS = [
  {
    title: 'Disconnected Silos',
    desc: 'Outreach teams, shelters, and hospital clinics operate on isolated databases, creating informational blindspots where vulnerable individuals vanish.',
    solution: 'Unified single-ledger registry with scoped role views and zero data leakage.',
  },
  {
    title: 'Untracked Referrals',
    desc: 'Caseworkers dispatch referrals by phone or paper slips with zero confirmation whether the individual arrived or was turned away at the door.',
    solution: 'Real-time capacity reservation with mandatory turn-away reason logging and audit trails.',
  },
  {
    title: 'Missed Follow-Ups',
    desc: 'Acute care emergencies subside, leaving patients discharged onto the streets with no synchronized shelter notification or continuing care.',
    solution: 'Automated 14-day and 30-day follow-up calendar alerts with mandatory manager check-in.',
  },
  {
    title: 'Unverified Closures',
    desc: 'Agencies celebrate high referral tallies while actual human outcomes remain unknown. Cases get stamped completed prematurely.',
    solution: 'Strict dual-key verification gate: A case CANNOT close without confirmed delivery evidence.',
  },
];

const STAKEHOLDERS = [
  {
    title: 'Government Administrator',
    role: 'City & Regional Oversight',
    desc: 'Macro capacity dashboards, policy compliance auditing, resource budget distribution, and unalterable audit ledgers.',
    icon: <ShieldCheck className="w-6 h-6 text-[#176B67]" />,
    badge: 'GOV POLICY',
    link: '/dashboard/admin',
    metric: '99.8% SLA Compliance',
  },
  {
    title: 'Outreach Field Worker',
    role: 'Street Intake & Triage',
    desc: 'Minimal-consent field registrations, immediate severity matrix scoring, and real-time shelter bed reservations.',
    icon: <Compass className="w-6 h-6 text-[#176B67]" />,
    badge: 'FIELD TRIAGE',
    link: '/dashboard/outreach',
    metric: '4 min Avg. Intake',
  },
  {
    title: 'Shelter Coordinator',
    role: 'Bed Sanctuary & Intake',
    desc: 'Live bed inventory sync, incoming referral queue triage, physical admission confirmation, and supply tracking.',
    icon: <HomeIcon className="w-6 h-6 text-[#176B67]" />,
    badge: 'BED CENSUS',
    link: '/dashboard/shelter',
    metric: '18 Available Beds',
  },
  {
    title: 'Hospital Coordinator',
    role: 'Acute Clinical Care',
    desc: 'Medical assistance referrals, psychiatric emergency intake, pharmaceutical verification, and coordinated clinical discharge.',
    icon: <HeartPulse className="w-6 h-6 text-[#176B67]" />,
    badge: 'CLINICAL CARE',
    link: '/dashboard/hospital',
    metric: '100% Medical Proof',
  },
  {
    title: 'Case Manager',
    role: 'Long-Term Stewardship',
    desc: 'Independent delivery verification, multi-domain case timelines, overdue follow-up escalation, and guarded closure gate.',
    icon: <Users className="w-6 h-6 text-[#176B67]" />,
    badge: 'VERIFICATION GATE',
    link: '/dashboard/manager',
    metric: 'Guarded Dual-Key Gate',
  },
];

export default function HomePage() {
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(0);
  const [problemTab, setProblemTab] = useState<'problem' | 'solution'>('solution');

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative">
      {/* Brand Navigation Bar */}
      <BrandNavbar />

      <main className="flex-1">
        {/* 1. HERO SECTION (Midnight Navy Framing with Subtle Teal & 3D Constellation) */}
        <section className="relative bg-[#101D32] text-white pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle Ambient Teal & Gold Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#176B67]/20 via-[#35A99A]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#D8B77A]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Typography & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                {/* GovTech Trust Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#182B49] px-4 py-1.5 text-xs font-mono text-[#35A99A] border border-[#35A99A]/30 shadow-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35A99A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35A99A]"></span>
                  </span>
                  <span className="tracking-wider uppercase">MUNICIPAL SOCIAL SAFETY PLATFORM</span>
                  <span className="text-white/30">|</span>
                  <span className="text-[#D8B77A] font-semibold">GOVTECH CERTIFIED</span>
                </motion.div>

                {/* Hero Heading: Character / Word stagger reveal */}
                <div className="space-y-2">
                  <AnimatedHeading
                    as="h1"
                    mode="word"
                    text="Connecting Every Need. Ensuring Every Care."
                    highlightWords={['Every', 'Need.', 'Care.']}
                    highlightClass="text-[#35A99A] font-extrabold"
                    className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]"
                  />
                </div>

                {/* Supporting Text */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-lg sm:text-xl text-[#F5F3EC]/80 leading-relaxed max-w-2xl font-normal"
                >
                  One connected platform bringing outreach teams, shelters, hospitals and social
                  organisations together to ensure every individual receives the support they need.
                </motion.p>

                {/* CTA Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >
                  <PremiumButton
                    href="#explore"
                    variant="primary"
                    size="xl"
                    withArrow
                  >
                    Explore AidBridge
                  </PremiumButton>

                  <PremiumButton
                    href="/login"
                    variant="navy"
                    size="xl"
                    className="border border-[#E4E8E5]/30 hover:border-[#35A99A]"
                    icon={<Lock className="w-4 h-4 text-[#D8B77A]" />}
                  >
                    Access the Platform
                  </PremiumButton>
                </motion.div>

                {/* Live System Invariant Metrics */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-xl"
                >
                  <div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#35A99A]">
                      100%
                    </div>
                    <div className="text-xs text-[#F5F3EC]/70 mt-1 font-medium">
                      Guarded Delivery Verification
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#D8B77A]">
                      0
                    </div>
                    <div className="text-xs text-[#F5F3EC]/70 mt-1 font-medium">
                      Dropped Paper Referrals
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                      5
                    </div>
                    <div className="text-xs text-[#F5F3EC]/70 mt-1 font-medium">
                      Unified Agency Desks
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Unique 3D Humanitarian Network Constellation */}
              <div className="lg:col-span-5 relative">
                <HeroEcosystemConstellation />
              </div>
            </div>
          </div>
        </section>

        {/* 2. REAL-TIME TELEMETRY MARQUEE (Midnight Navy Strip) */}
        <section className="bg-[#182B49] py-3 border-y border-[#E4E8E5]/15">
          <Marquee speed="normal">
            <div className="flex items-center space-x-12 px-6 text-xs font-mono text-[#F5F3EC]/80">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#21845A] animate-pulse" />
                <span className="text-[#35A99A] font-bold">LIVE TELEMETRY:</span>
                <span>[CASE #0101] Hope Haven Sanctuary confirmed bed admission for vulnerable adult</span>
              </span>
              <span className="text-[#F5F3EC]/30">•</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D8B77A]" />
                <span className="text-[#D8B77A] font-bold">VERIFICATION:</span>
                <span>Case Manager Amara Patel signed dual-key delivery audit</span>
              </span>
              <span className="text-[#F5F3EC]/30">•</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#35A99A]" />
                <span className="text-[#35A99A] font-bold">STREET TRIAGE:</span>
                <span>Outreach Field Unit 3 logged non-intrusive consent in North District</span>
              </span>
              <span className="text-[#F5F3EC]/30">•</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#21845A]" />
                <span className="text-[#21845A] font-bold">HOSPITAL DISPATCH:</span>
                <span>St. Jude Health Clinic logged acute medical triage complete</span>
              </span>
            </div>
          </Marquee>
        </section>

        {/* 3. THE CORE PROBLEM VS. AIDBRIDGE TRANSFORMATION (Warm Ivory & Pure White) */}
        <section id="explore" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-3.5 py-1 text-xs font-mono text-[#176B67] border border-[#176B67]/20 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#176B67]" />
                  <span>SYSTEMIC SAFETY NET CHALLENGE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#182536] tracking-tight">
                  Why Social Care Systems Fail Vulnerable Lives
                </h2>
                <p className="mt-4 text-base text-[#64748B] leading-relaxed">
                  Millions in public social budgets are lost annually not from lack of compassion,
                  but from fragmented handoffs and unverified case closures.
                </p>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E4E8E5] shadow-sm self-start md:self-auto">
                <button
                  onClick={() => setProblemTab('problem')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    problemTab === 'problem'
                      ? 'bg-[#C94C4C]/10 text-[#C94C4C] border border-[#C94C4C]/30 shadow-sm'
                      : 'text-[#64748B] hover:text-[#182536]'
                  }`}
                >
                  Traditional Pitfalls
                </button>
                <button
                  onClick={() => setProblemTab('solution')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    problemTab === 'solution'
                      ? 'bg-[#176B67] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#182536]'
                  }`}
                >
                  The AidBridge Solution
                </button>
              </div>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROBLEM_POINTS.map((item, idx) => (
                <div
                  key={item.title}
                  className="bg-white p-7 rounded-2xl border border-[#E4E8E5] shadow-card hover:shadow-card-elevated hover:border-[#176B67]/40 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-mono font-bold text-[#64748B]">
                        STAGE 0{idx + 1}
                      </span>
                      {problemTab === 'problem' ? (
                        <span className="w-7 h-7 rounded-lg bg-[#C94C4C]/10 border border-[#C94C4C]/30 flex items-center justify-center text-[#C94C4C]">
                          <XCircle className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-lg bg-[#E8F3F0] border border-[#176B67]/30 flex items-center justify-center text-[#176B67]">
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-3 text-[#182536]">{item.title}</h3>

                    {problemTab === 'problem' ? (
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {item.desc}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#176B67] font-bold block">
                          AidBridge Closed-Loop:
                        </span>
                        <p className="text-xs sm:text-sm text-[#182536] leading-relaxed font-medium">
                          {item.solution}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E4E8E5] flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>STATUS</span>
                    <span
                      className={`font-semibold ${
                        problemTab === 'problem' ? 'text-[#C94C4C]' : 'text-[#176B67]'
                      }`}
                    >
                      {problemTab === 'problem' ? 'VULNERABILITY' : 'RESOLVED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. THE 6-STAGE ASSISTANCE PROTOCOL */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E4E8E5]">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-3.5 py-1 text-xs font-mono text-[#176B67] border border-[#176B67]/20 mb-3">
                <Activity className="w-3.5 h-3.5 text-[#176B67]" />
                <span>UNIFIED CASE CONTINUUM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#182536] tracking-tight">
                From Street Intake to Verified Stabilization
              </h2>
              <p className="mt-4 text-base text-[#64748B] leading-relaxed">
                Click any stage below to inspect the mandatory evidence requirements, authorized
                actors, and audit controls that govern every AidBridge case.
              </p>
            </div>

            {/* Stepper Tabs Bar */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
              {WORKFLOW_STAGES.map((s, idx) => {
                const isActive = selectedWorkflowStep === idx;
                return (
                  <button
                    key={s.step}
                    onClick={() => setSelectedWorkflowStep(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-[#176B67] text-white border-[#176B67] shadow-sm'
                        : 'bg-[#F5F3EC] text-[#182536] border-[#E4E8E5] hover:bg-[#E8F3F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#D8B77A]' : 'text-[#176B67]'}`}>
                        {s.step}
                      </span>
                      <span className={`text-[10px] font-mono ${isActive ? 'text-white/70' : 'text-[#64748B]'}`}>
                        {s.tag}
                      </span>
                    </div>
                    <div className="text-sm font-bold truncate">{s.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Step Deep Dive Card */}
            {(() => {
              const current = WORKFLOW_STAGES[selectedWorkflowStep];
              return (
                <div className="bg-[#F5F3EC] p-8 sm:p-10 rounded-3xl border border-[#E4E8E5] shadow-card">
                  <div className="grid gap-8 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#176B67] text-white">
                          STAGE {current.step} OF 06
                        </span>
                        <span className="text-xs font-mono text-[#64748B]">
                          LEAD ACTOR: <strong className="text-[#182536]">{current.actor}</strong>
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold text-[#182536]">
                        {current.title} — {current.subtitle}
                      </h3>

                      <p className="text-base text-[#64748B] leading-relaxed font-normal">
                        {current.desc}
                      </p>

                      <div className="pt-4 border-t border-[#E4E8E5]">
                        <div className="text-xs font-mono uppercase tracking-wider text-[#176B67] mb-1 font-bold">
                          Mandatory Evidence Logged to Ledger:
                        </div>
                        <div className="text-sm text-[#182536] font-medium">
                          {current.evidence}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E4E8E5] p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#64748B] uppercase">
                          Cryptographic State
                        </span>
                        <span className="text-xs font-mono text-[#21845A] font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED INVARIANT
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-mono bg-[#101D32] text-white p-4 rounded-xl border border-white/5">
                        <div className="text-[#F5F3EC]/50">// Audit Assertion #{current.step}</div>
                        <div className="text-[#35A99A]">
                          ASSERT case.status == {current.step === '05' ? '"VERIFIED"' : '"IN_PROGRESS"'}
                        </div>
                        <div className="text-[#D8B77A]">REQUIRE evidence.timestamp != NULL</div>
                        <div className="text-[#F5F3EC]/70">SIGNATURE actor({current.actor})</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs text-[#64748B]">
                        <span>Tamper-Proof Ledger</span>
                        <span className="text-[#182536] font-mono font-bold">SHA-256 Validated</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* 5. INTERACTIVE SERVICE COVERAGE MAP */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-3.5 py-1 text-xs font-mono text-[#176B67] border border-[#176B67]/20 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#176B67]" />
                <span>GEOSPATIAL REACH</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#182536] tracking-tight">
                Metropolitan Service Network
              </h2>
              <p className="mt-3 text-base text-[#64748B]">
                Explore registered emergency shelters, acute clinics, and food distribution hubs in real time.
              </p>
            </div>

            <ServiceNetworkMap />
          </div>
        </section>

        {/* 6. THE GOLDEN RULE GATE (Midnight Navy Focus) */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#101D32] text-white relative">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-[#182B49] p-8 sm:p-12 rounded-3xl border border-[#D8B77A]/30 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="max-w-xl space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#D8B77A]/20 px-3 py-1 text-xs font-mono text-[#D8B77A] border border-[#D8B77A]/40">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#D8B77A]" />
                    <span>THE AIDBRIDGE GOLDEN RULE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Referral Acceptance Does Not Equal Case Closure
                  </h3>
                  <p className="text-sm text-[#F5F3EC]/80 leading-relaxed">
                    Most social systems mark a referral &ldquo;completed&rdquo; the moment a hospital
                    or shelter clicks accept. In AidBridge, actual physical service delivery must be
                    recorded with evidence notes, and independently verified by an authorized Case
                    Manager before any case can be closed.
                  </p>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                  <PremiumButton href="/how-it-works" variant="primary" size="lg" withArrow>
                    Inspect Complete Protocol
                  </PremiumButton>
                  <PremiumButton
                    href="/about"
                    variant="outline"
                    size="lg"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    Read Our Safeguards
                  </PremiumButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FIVE COORDINATED STAKEHOLDER WORKSPACES */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E4E8E5]">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-3.5 py-1 text-xs font-mono text-[#176B67] border border-[#176B67]/20 mb-3">
                  <Users className="w-3.5 h-3.5 text-[#176B67]" />
                  <span>ROLE-BASED CODESK ARCHITECTURE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#182536] tracking-tight">
                  Tailored Workspaces for Every Role
                </h2>
                <p className="mt-3 text-base text-[#64748B] leading-relaxed max-w-xl">
                  Each desk is precision-engineered for its specific operational mandate with
                  strict role-based data scoping.
                </p>
              </div>

              <PremiumButton href="/login" variant="outline" size="md" withArrow>
                Test All Workspaces via 1-Click
              </PremiumButton>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {STAKEHOLDERS.map((s) => (
                <div
                  key={s.title}
                  className="bg-white p-7 rounded-2xl border border-[#E4E8E5] shadow-card hover:shadow-card-elevated hover:border-[#176B67] transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#E8F3F0] flex items-center justify-center group-hover:bg-[#176B67] transition-colors">
                        <span className="text-[#176B67] group-hover:text-white transition-colors">
                          {s.icon}
                        </span>
                      </div>
                      <Badge variant="champagne" className="text-[10px]">
                        {s.badge}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-[#182536] group-hover:text-[#176B67] transition-colors mb-1">
                      {s.title}
                    </h3>
                    <p className="text-xs font-mono text-[#64748B] mb-3">{s.role}</p>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#E4E8E5] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#176B67] font-semibold">{s.metric}</span>
                    <Link
                      href="/login"
                      className="text-xs font-mono text-[#182536] flex items-center gap-1 group-hover:text-[#176B67] transition-colors font-medium"
                    >
                      <span>Open Desk</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FINAL CALL TO ACTION (Warm Ivory with Deep Teal Button) */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 text-center bg-[#F5F3EC]">
          <div className="container mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-4 py-1.5 text-xs font-mono text-[#176B67] border border-[#176B67]/30 mb-2">
              <Sparkles className="w-4 h-4 text-[#176B67]" />
              <span>EXPERIENCE THE FUTURE OF SOCIAL SAFETY</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#182536] tracking-tight">
              Ready to See Verifiable Care in Action?
            </h2>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
              Launch our live municipal testbed to evaluate the five role desks, walk through real
              case trajectories, and experience closed-loop accountability.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <PremiumButton href="/login" variant="primary" size="xl" withArrow>
                Access the Platform
              </PremiumButton>
              <PremiumButton href="/network" variant="outline" size="xl">
                Explore Stakeholder Network
              </PremiumButton>
            </div>
          </div>
        </section>
      </main>

      {/* Global Brand Footer */}
      <BrandFooter />
    </div>
  );
}
