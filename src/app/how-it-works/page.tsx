'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Users,
  Activity,
  Sparkles,
  AlertCircle,
  Clock,
  Compass,
  Home as HomeIcon,
  HeartPulse,
  Lock,
} from 'lucide-react';
import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { BlackHole } from '@/components/3d/BlackHole';
import { Journey3D } from '@/components/3d/Journey3D';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';

const LIFECYCLE_STEPS = [
  {
    step: '01',
    title: 'Field Intake & Safe Registry',
    subtitle: 'Street outreach with radical data minimization',
    desc: 'An outreach worker meets a vulnerable individual on the street or in transit hubs. Only vital safeguarding details, urgent needs, and shelter preferences are captured. No smartphones, state IDs, or permanent addresses are required.',
    actor: 'Outreach Worker',
    tag: 'SAFE REGISTRY',
    evidence: 'Verbal consent record, GPS locus, safeguarding flags',
  },
  {
    step: '02',
    title: 'Multi-Domain Needs Matrix',
    subtitle: 'Standardized severity diagnostic scoring',
    desc: 'The caseworker assesses immediate physical survival priorities across emergency beds, clinical stabilization, food security, and child protection, generating automated urgency scores (Critical, High, Medium, Low).',
    actor: 'Field Worker / Case Manager',
    tag: 'PRIORITY MATRIX',
    evidence: 'Scored needs assessment entries, priority tiering',
  },
  {
    step: '03',
    title: 'Targeted Provider Referral',
    subtitle: 'Capacity-synchronized dispatch with reason logging',
    desc: 'The referral engine matches the case with certified partner shelters or trauma clinics based on live bed counts. Providers must explicitly accept or document mandatory justification if turned away.',
    actor: 'Shelter / Hospital Coordinator',
    tag: 'CAPACITY MATCH',
    evidence: 'Direct reservation, bed quota lock, audited turn-away log',
  },
  {
    step: '04',
    title: 'Service Delivery & Tangible Proof',
    subtitle: 'Mandatory intake receipt and timestamp logging',
    desc: 'Upon physical intake, the provider logs tangible verification: bed number assigned, medication regimen administered, or emergency rations issued, shifting the case status to PENDING_VERIFICATION.',
    actor: 'Service Provider Coordinator',
    tag: 'DELIVERY RECEIPT',
    evidence: 'Physical intake proof, bed # / clinic intake timestamp',
  },
  {
    step: '05',
    title: 'Dual-Key Verification & Closure Gate',
    subtitle: 'Independent audit before case resolution',
    desc: 'A case CANNOT close simply because a referral was accepted. An authorized Case Manager independently reviews the delivery proof, confirms human stabilization, and signs the verification ledger.',
    actor: 'Case Manager / Admin',
    tag: 'GUARDED CLOSURE',
    evidence: 'Independent caseworker sign-off, cryptographic ledger entry',
  },
  {
    step: '06',
    title: 'Structured 30-Day Follow-Up',
    subtitle: 'Preventing recidivism and long-term slip',
    desc: 'Post-delivery check-ins track long-term housing placement, ongoing medical adherence, and welfare enrollment to ensure the individual remains permanently stabilized.',
    actor: 'Case Manager',
    tag: 'PERMANENT STABILITY',
    evidence: '14-day & 30-day scheduled checks, outcome record',
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative">
      <BrandNavbar />

      <main className="flex-1">
        {/* 1. Header with Journey3D (Midnight Navy Hero) */}
        <section className="bg-[#101D32] text-white pt-12 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10 space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#182B49] px-4 py-1.5 text-xs font-mono text-[#35A99A] border border-[#35A99A]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B77A]" />
                <span>THE 6-STAGE CLOSED-LOOP PROTOCOL</span>
              </div>

              <AnimatedHeading
                as="h1"
                mode="word"
                text="How AidBridge Coordinates & Verifies Care"
                highlightWords={['Coordinates', 'Verifies', 'Care']}
                highlightClass="text-[#35A99A] font-extrabold"
                className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
              />

              <p className="text-sm sm:text-base text-[#F5F3EC]/80 leading-relaxed max-w-2xl mx-auto">
                A closed-loop GovTech architecture that eliminates dropped referrals by holding
                every agency mutually accountable to physical service delivery and independent verification.
              </p>
            </div>

            {/* 3D Journey Component */}
            <div className="max-w-5xl mx-auto">
              <Journey3D />
            </div>
          </div>
        </section>

        {/* 2. Step-by-Step Interactive Workflow */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                  DETAILED LIFECYCLE BREAKDOWN
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                  Six Mandatory Stages of Verified Care
                </h3>
              </div>
              <span className="text-xs font-mono text-[#176B67] font-bold">
                STAGE {activeStep + 1} OF 6 ACTIVE
              </span>
            </div>

            {/* Stepper Card Stack */}
            <div className="space-y-4">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <div
                    key={step.step}
                    onClick={() => setActiveStep(idx)}
                    className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#176B67] shadow-card-elevated ring-1 ring-[#176B67]/30'
                        : 'bg-white/80 border-[#E4E8E5] hover:bg-white hover:border-[#176B67]/40 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-5">
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-base font-bold shadow-sm ${
                            isSelected
                              ? 'bg-[#176B67] text-white'
                              : 'bg-[#E8F3F0] text-[#176B67]'
                          }`}
                        >
                          {step.step}
                        </span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant={isSelected ? 'teal' : 'default'} className="text-[10px]">
                              {step.tag}
                            </Badge>
                            <span className="text-xs font-mono text-[#64748B]">
                              Lead Actor: <strong className="text-[#182536]">{step.actor}</strong>
                            </span>
                          </div>

                          <h4 className="text-xl font-bold text-[#182536] tracking-tight">
                            {step.title}
                          </h4>
                          <p className="text-xs font-mono text-[#176B67] font-medium">{step.subtitle}</p>

                          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-2 max-w-2xl">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      {/* Evidence Pill */}
                      <div className="lg:w-80 p-4 rounded-xl bg-[#F5F3EC] border border-[#E4E8E5] space-y-1.5 shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#182536] block font-bold">
                          Mandatory Audit Evidence:
                        </span>
                        <p className="text-xs text-[#176B67] font-mono leading-relaxed font-semibold">
                          {step.evidence}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. 3D Assistance Corridor Simulation (Gallery Tunnel) */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E4E8E5]">
          <div className="container mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                  INTERACTIVE DELIVERY PROTOCOLS
                </span>
                <h3 className="text-2xl font-bold text-[#182536] tracking-tight">
                  Assistance Pathways Under Verification
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B] hidden sm:inline">
                Continuous 3D verification flight
              </span>
            </div>

            <div className="h-[400px] sm:h-[460px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 shadow-xl">
              <GalleryTunnel speedMultiplier={0.8} interactive={true} />
            </div>
          </div>
        </section>

        {/* 4. Connected Ecosystem Convergence (Black Hole) */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E4E8E5] shadow-card">
              <div className="grid gap-10 lg:grid-cols-12 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-3.5 py-1 text-xs font-mono text-[#176B67] border border-[#176B67]/20">
                    <Activity className="w-3.5 h-3.5 text-[#176B67]" />
                    <span>CLOSED-LOOP GRAVITATIONAL CONVERGENCE</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                    Every Interaction Gravitates Back to the Individual
                  </h3>

                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Unlike traditional linear processes where cases drift off into unmonitored queues,
                    AidBridge acts as a cohesive gravitational field: every referral, bed allocation,
                    prescription, and verification rotates tightly around the central beneficiary until
                    verified permanent stabilization is achieved.
                  </p>

                  <div className="pt-2">
                    <PremiumButton href="/network" variant="primary" size="md" withArrow>
                      Explore Stakeholder Network
                    </PremiumButton>
                  </div>
                </div>

                <div className="lg:col-span-6 relative h-[360px] rounded-2xl overflow-hidden bg-[#101D32] border border-white/10 shadow-lg">
                  <BlackHole
                    particleCount={2400}
                    size={0.9}
                    interactive={true}
                    showTelemetry={true}
                    accentTitle="CONVERGED CARE ECOSYSTEM"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
