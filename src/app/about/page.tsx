'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  HeartHandshake,
  Eye,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Layers,
  Activity,
  Compass,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';
import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { BlackHole } from '@/components/3d/BlackHole';
import { AboutEcosystem3D } from '@/components/3d/AboutEcosystem3D';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative">
      <BrandNavbar />

      <main className="flex-1">
        {/* 1. Header Section in Midnight Navy with 3D Ecosystem Visualization */}
        <section className="bg-[#101D32] text-white pt-12 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10 space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#182B49] px-4 py-1.5 text-xs font-mono text-[#35A99A] border border-[#35A99A]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B77A]" />
                <span>THE AIDBRIDGE MISSION &amp; CIVIC ARCHITECTURE</span>
              </div>

              <AnimatedHeading
                as="h1"
                mode="word"
                text="Architected to Eliminate the Referral Void"
                highlightWords={['Eliminate', 'Referral', 'Void']}
                highlightClass="text-[#35A99A] font-extrabold"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
              />

              <p className="text-base sm:text-lg text-[#F5F3EC]/80 leading-relaxed">
                AidBridge is a municipal-grade Unified Social Care Verification Platform engineered
                to solve one of the most persistent and costly tragedies in public safety nets:
                unverified referrals where vulnerable people vanish between agencies.
              </p>
            </div>

            {/* 3D Interconnected Social-Support Ecosystem */}
            <div className="max-w-4xl mx-auto">
              <AboutEcosystem3D />
            </div>
          </div>
        </section>

        {/* 2. Assistance Domain Corridor with GalleryTunnel */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                  IMMERSIVE 3D VISUALIZATION
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                  The Assistance Domain Corridor
                </h3>
              </div>
              <p className="text-xs text-[#64748B] font-mono">
                Click or hover any 3D panel to inspect the active care protocol
              </p>
            </div>

            <div className="h-[440px] sm:h-[500px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 shadow-xl relative">
              <GalleryTunnel
                speedMultiplier={0.7}
                interactive={true}
                onPanelSelect={(domain) => setSelectedProtocol(domain)}
              />
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-[#101D32]/90 border border-white/10 text-[11px] font-mono text-[#F5F3EC]/80">
                  SECTOR: METROPOLITAN CARE PROTOCOLS
                </span>
              </div>
            </div>

            {selectedProtocol && (
              <div className="bg-white p-4 rounded-2xl border border-[#176B67] text-center shadow-sm animate-fade-in">
                <span className="text-xs font-mono text-[#176B67]">
                  ACTIVE DOMAIN SELECTED: <strong className="text-[#101D32]">{selectedProtocol}</strong>
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 3. The Referral Black Hole vs The AidBridge Mandate */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E4E8E5]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              {/* Left: The Black Hole Visual */}
              <div className="lg:col-span-5 relative">
                <div className="h-[460px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#D8B77A]/30 shadow-xl relative">
                  <BlackHole
                    particleCount={2400}
                    size={1}
                    interactive={true}
                    showTelemetry={true}
                    accentTitle="THE REFERRAL BLACK HOLE PHENOMENON"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                    <div className="bg-[#101D32]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[11px] font-mono text-[#F5F3EC]/80 text-center">
                      HISTORICAL VOID // 38% OF UNTRACKED PAPER REFERRALS DISAPPEAR HERE
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: The Breakdown & Solution */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#C94C4C]/10 px-3 py-1 text-xs font-mono text-[#C94C4C] border border-[#C94C4C]/30">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C94C4C]" />
                  <span>THE SYSTEMIC PROBLEM</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-[#182536] tracking-tight">
                  Why Referrals Become Black Holes
                </h2>

                <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                  In cities worldwide, outreach workers find unhoused individuals, at-risk families, or
                  elderly persons in crisis and issue paper slips or record siloed notes. The agency
                  proudly marks the case as &ldquo;Referred&rdquo;.
                </p>

                <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                  Yet the person arrives at a shelter with no available beds, or never arrives at all.
                  The agency considers their obligation complete, while the human being remains stranded
                  in the street.
                </p>

                <div className="bg-[#E8F3F0] p-6 rounded-2xl border border-[#176B67]/30">
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-[#176B67] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-bold text-[#101D32] mb-1">
                        The AidBridge Invariant Gate
                      </h4>
                      <p className="text-xs sm:text-sm text-[#182536] leading-relaxed">
                        AidBridge legally and technologically enforces that{' '}
                        <strong className="text-[#176B67]">
                          a case cannot be marked closed simply because a referral was created or
                          accepted.
                        </strong>{' '}
                        Physical service delivery must be recorded with timestamped evidence and
                        independently verified by an authorized Case Manager.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Core Safeguarding Principles (Pure White Cards on Warm Ivory) */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl space-y-12">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                CIVIC TRUST &amp; SAFEGUARDS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                Four Pillars of GovTech Integrity
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-2xl border border-[#E4E8E5] shadow-card space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#176B67]">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#182536]">Data Minimisation</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Only essential triage information is gathered. No state IDs, biometric scans, or
                  surveillance requirements that deter vulnerable individuals from seeking aid.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E4E8E5] shadow-card space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#176B67]">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#182536]">Role-Based Scoping</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Shelters see bed allocations; hospital clinics see medical triage; outreach sees
                  field encounters. Strict data partitioning prevents unauthorized cross-agency leakages.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E4E8E5] shadow-card space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#176B67]">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#182536]">Immutable Ledger</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Every intake, bed assignment, turn-away reason, and manager verification is permanently
                  recorded in an unalterable cryptographic audit trail.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E4E8E5] shadow-card space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#176B67]">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#182536]">Guarded Outcomes</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Dual-key verification prevents premature resolution. 14-day and 30-day touchpoints
                  ensure recipients achieve permanent stability.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E4E8E5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-[#64748B]">
                AIDBRIDGE GOVTECH SPECIFICATION • ARCHITECTURE v4.2
              </span>
              <PremiumButton href="/login" variant="primary" size="md" withArrow>
                Launch Live Testbed
              </PremiumButton>
            </div>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
