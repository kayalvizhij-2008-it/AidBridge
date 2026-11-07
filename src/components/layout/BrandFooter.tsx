'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';

export function BrandFooter() {
  return (
    <footer className="w-full bg-[#101D32] text-[#F5F3EC] border-t border-[#E4E8E5]/15 pt-16 pb-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E4E8E5]/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B67] text-white">
                <ShieldCheck className="h-5 w-5 text-[#D8B77A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">AidBridge</span>
                <span className="text-[10px] font-mono tracking-widest text-[#D8B77A] uppercase">
                  GovTech Social Care Platform
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#F5F3EC]/70 max-w-sm leading-relaxed">
              Connecting outreach teams, shelters, clinical care facilities, and case managers onto a unified verification ledger. Ensuring assistance is genuinely delivered before cases close.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#176B67]/30 border border-[#35A99A]/40 text-[#35A99A]">
                <span className="w-2 h-2 rounded-full bg-[#35A99A] animate-pulse" />
                Dual-Key Delivery Verification Active
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D8B77A] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5F3EC]/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Overview & Tour
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Assistance Domains
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-white transition-colors">
                  Stakeholder Network
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition-colors">
                  Impact & Transparency
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Desks */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D8B77A] mb-4">
              Role Workspaces
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5F3EC]/70">
              <li>
                <Link href="/dashboard/admin" className="hover:text-white transition-colors">
                  Government Admin
                </Link>
              </li>
              <li>
                <Link href="/dashboard/outreach" className="hover:text-white transition-colors">
                  Street Outreach Worker
                </Link>
              </li>
              <li>
                <Link href="/dashboard/shelter" className="hover:text-white transition-colors">
                  Shelter Coordinator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/hospital" className="hover:text-white transition-colors">
                  Hospital Coordinator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/manager" className="hover:text-white transition-colors">
                  Case Manager Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safeguards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D8B77A] mb-4">
              Safeguards & Access
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5F3EC]/70">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Platform Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Agency Accreditation
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About AidBridge
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Mandatory Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F3EC]/60">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#35A99A]" />
            <span>
              AidBridge GovTech Verification Architecture. Zero unverified closures.
            </span>
          </div>
          <div className="text-center sm:text-right font-mono text-[11px] text-[#D8B77A]/90">
            DEMONSTRATION SYSTEM • SYNTHETIC DATA FOR EVALUATION PURPOSES
          </div>
        </div>
      </div>
    </footer>
  );
}

export default BrandFooter;
