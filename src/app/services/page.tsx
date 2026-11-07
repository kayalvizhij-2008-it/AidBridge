'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Utensils,
  HeartPulse,
  Baby,
  UserCheck,
  Scale,
  ShieldCheck,
  ArrowRight,
  FileCheck,
  Sparkles,
  Lock,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { BlackHole } from '@/components/3d/BlackHole';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';

const SERVICES = [
  {
    title: 'Emergency Shelter & Bed Allocation',
    category: 'Shelter & Sanctuary',
    desc: 'Live bed inventory synchronization across municipal night sanctuaries, transitional dormitories, and domestic crisis safehouses with documented admission receipts.',
    icon: <Home className="h-6 w-6 text-[#176B67]" />,
    stats: '142 Beds Coordinated',
    leadRole: 'Shelter Coordinator',
    evidence: 'Mandatory bed number, intake timestamp, verified physical presence',
  },
  {
    title: 'Nutritional Support & Food Security',
    category: 'Food Security',
    desc: 'Daily emergency meal quotas, community pantry dispatch, and non-perishable ration bundles verified upon physical hand-off.',
    icon: <Utensils className="h-6 w-6 text-[#176B67]" />,
    stats: '250 Rations Daily',
    leadRole: 'Food Hub & Outreach',
    evidence: 'Ration bundle ID, recipient acknowledgment, dietary allergen notes',
  },
  {
    title: 'Acute Healthcare & Clinical Triage',
    category: 'Medical Assistance',
    desc: 'Primary street diagnosis, trauma stabilization, respiratory support, and confidential hospital triage coordinated with municipal emergency departments.',
    icon: <HeartPulse className="h-6 w-6 text-[#176B67]" />,
    stats: 'HIPAA-Aligned Privacy',
    leadRole: 'Hospital Coordinator',
    evidence: 'Clinical triage chart, medication administration, attending physician ID',
  },
  {
    title: 'Child Protection & Minor Safeguarding',
    category: 'Child Protection',
    desc: 'Rapid protocol for unaccompanied youth and street children. Automatic juvenile welfare escalation without identification friction.',
    icon: <Baby className="h-6 w-6 text-[#176B67]" />,
    stats: 'Mandatory Priority Alert',
    leadRole: 'Outreach & Child Welfare',
    evidence: 'Immediate guardian tracing log, social worker escort verification',
  },
  {
    title: 'Elderly Care & Geriatric Mobility',
    category: 'Elderly Inclusion',
    desc: 'Targeted support for homeless seniors, chronic mobility aids, specialized medical respite housing, and pension continuity.',
    icon: <UserCheck className="h-6 w-6 text-[#176B67]" />,
    stats: 'Geriatric Triage Active',
    leadRole: 'Case Manager & Shelter',
    evidence: 'Mobility assessment, respite bed reservation, prescription sync',
  },
  {
    title: 'Welfare Subsidies & Legal Advocacy',
    category: 'Social Inclusion',
    desc: 'Case management representation securing municipal rent relief, disability pensions, and permanent housing subsidies.',
    icon: <Scale className="h-6 w-6 text-[#176B67]" />,
    stats: 'Municipal Liaison Desk',
    leadRole: 'Government Administrator',
    evidence: 'Municipal case ID, subsidy disbursement confirmation, tenancy deed',
  },
];

export default function ServicesPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative">
      <BrandNavbar />

      <main className="flex-1">
        {/* 1. Header Section in Midnight Navy */}
        <section className="bg-[#101D32] text-white pt-12 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10 space-y-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#182B49] px-4 py-1.5 text-xs font-mono text-[#35A99A] border border-[#35A99A]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B77A]" />
                <span>COORDINATED ASSISTANCE DOMAINS</span>
              </div>

              <AnimatedHeading
                as="h1"
                mode="word"
                text="Essential Care, Verified at Every Stage"
                highlightWords={['Essential', 'Care,', 'Verified']}
                highlightClass="text-[#35A99A] font-extrabold"
                className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
              />

              <p className="text-sm sm:text-base text-[#F5F3EC]/80 leading-relaxed max-w-2xl mx-auto">
                AidBridge orchestrates six critical social safety tracks on a shared cryptographic
                verification ledger. Every service requires tangible delivery proof before resolution.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Interactive Domain Corridor with GalleryTunnel */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                  INTERACTIVE DOMAIN CORRIDOR
                </span>
                <h3 className="text-2xl font-bold text-[#182536] tracking-tight">
                  Explore Verified Care Disciplines
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B] hidden sm:inline">
                Click any panel to inspect domain details
              </span>
            </div>

            <div className="h-[420px] sm:h-[480px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 shadow-xl relative">
              <GalleryTunnel
                speedMultiplier={0.8}
                interactive={true}
                onPanelSelect={(name) => setSelectedDomain(name)}
              />
            </div>

            {selectedDomain && (
              <div className="bg-white p-4 rounded-2xl border border-[#176B67] text-center shadow-sm animate-fade-in">
                <span className="text-xs font-mono text-[#176B67]">
                  SELECTED DISCIPLINE: <strong className="text-[#101D32]">{selectedDomain}</strong>
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 3. Services Grid on Pure White Cards */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E4E8E5]">
          <div className="container mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#176B67] font-bold block mb-1">
                  STANDARDIZED PROTOCOLS
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                  Six Certified Assistance Domains
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                6 CERTIFIED DOMAINS
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((srv) => (
                <div
                  key={srv.title}
                  className="bg-white p-7 rounded-2xl border border-[#E4E8E5] shadow-card hover:border-[#176B67]/40 hover:shadow-card-elevated flex flex-col justify-between group transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#E8F3F0] flex items-center justify-center group-hover:bg-[#176B67] transition-colors">
                        <span className="group-hover:text-white transition-colors">{srv.icon}</span>
                      </div>
                      <Badge variant="champagne" className="text-[10px]">
                        {srv.stats}
                      </Badge>
                    </div>

                    <h4 className="text-lg font-bold text-[#182536] group-hover:text-[#176B67] transition-colors mb-1">
                      {srv.title}
                    </h4>
                    <p className="text-xs font-mono text-[#176B67] mb-3">{srv.category}</p>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#E4E8E5] space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#182536] font-bold">
                      Delivery Proof Requirement:
                    </div>
                    <p className="text-xs font-mono text-[#176B67] leading-relaxed font-semibold">
                      {srv.evidence}
                    </p>
                    <div className="pt-2 text-xs font-mono text-[#64748B] flex items-center justify-between">
                      <span>Lead: {srv.leadRole}</span>
                      <span className="text-[#21845A] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Converged Multi-Service Co-Dispatch with Black Hole */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E4E8E5] shadow-card">
              <div className="grid gap-10 lg:grid-cols-12 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-3.5 py-1 text-xs font-mono text-[#176B67] border border-[#176B67]/20">
                    <Activity className="w-3.5 h-3.5 text-[#176B67]" />
                    <span>SYNCHRONIZED MULTI-SERVICE DISPATCH</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                    Single Beneficiary, Multiple Synchronized Aids
                  </h3>

                  <p className="text-sm text-[#64748B] leading-relaxed">
                    A vulnerable individual frequently requires simultaneous shelter, nutritional
                    support, and acute wound care. AidBridge coordinates these referrals concurrently
                    on the same case file, ensuring no domain drops out of contact.
                  </p>

                  <div className="pt-2">
                    <PremiumButton href="/login" variant="primary" size="md" withArrow>
                      Access Triage Desks
                    </PremiumButton>
                  </div>
                </div>

                <div className="lg:col-span-6 h-[340px] rounded-2xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 relative shadow-lg">
                  <BlackHole
                    particleCount={2500}
                    size={0.95}
                    interactive={true}
                    showTelemetry={true}
                    accentTitle="MULTI-DOMAIN CARE CO-DISPATCH"
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
