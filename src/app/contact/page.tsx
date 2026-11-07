'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle2,
  MapPin,
  Sparkles,
  Phone,
  Building2,
  Lock,
} from 'lucide-react';
import { BrandNavbar } from '@/components/layout/BrandNavbar';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/badge';

const CONTACT_CHANNELS = [
  {
    title: 'Agency Coordination',
    value: 'agencies@aidbridge.local',
    desc: 'For municipal departments & social welfare boards',
    icon: <ShieldCheck className="h-5 w-5 text-[#176B67]" />,
  },
  {
    title: 'Provider Network',
    value: 'providers@aidbridge.local',
    desc: 'For emergency shelters, food banks & acute medical clinics',
    icon: <MessageSquare className="h-5 w-5 text-[#176B67]" />,
  },
  {
    title: 'Technical Integrations',
    value: 'support@aidbridge.local',
    desc: 'For GovTech API integrations & HL7/FHIR health relays',
    icon: <Mail className="h-5 w-5 text-[#176B67]" />,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Municipal Authority',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
                <span>COORDINATION &amp; TRIAGE DESK</span>
              </div>

              <AnimatedHeading
                as="h1"
                mode="word"
                text="Connect with the AidBridge Bureau"
                highlightWords={['Connect', 'AidBridge', 'Bureau']}
                highlightClass="text-[#35A99A] font-extrabold"
                className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
              />

              <p className="text-sm sm:text-base text-[#F5F3EC]/80 leading-relaxed max-w-2xl mx-auto">
                Reach out to our GovTech liaison desk for cross-agency deployments, licensed shelter
                onboarding, clinical integrations, or demonstration access.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Contact Channels on Pure White Cards */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F3EC]">
          <div className="container mx-auto max-w-7xl space-y-12">
            <div className="grid gap-6 sm:grid-cols-3">
              {CONTACT_CHANNELS.map((ch) => (
                <div
                  key={ch.title}
                  className="bg-white p-6 rounded-2xl border border-[#E4E8E5] shadow-card hover:border-[#176B67]/40 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#E8F3F0] flex items-center justify-center mb-4">
                    {ch.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#182536] mb-1">{ch.title}</h3>
                  <p className="font-mono text-xs text-[#176B67] font-semibold mb-2">{ch.value}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{ch.desc}</p>
                </div>
              ))}
            </div>

            {/* Split Layout: Accessible Form (Left) & Contained 3D Side Visual (Right) */}
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left: Form */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E8E5] shadow-card">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#182536] tracking-tight">Send a Dispatch Note</h2>
                    <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                      Direct inquiries are routed to the relevant municipal liaison desk within 2 business hours.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="flex flex-col items-center py-10 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#E8F3F0] border border-[#176B67]/40 flex items-center justify-center text-[#176B67]">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold text-[#182536]">Message Dispatched</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed max-w-sm">
                        Thank you, <strong className="text-[#182536]">{formData.name || 'colleague'}</strong>.
                        Your inquiry regarding <strong className="text-[#176B67]">{formData.department}</strong> has
                        been entered into the demonstration coordination queue.
                      </p>
                      <PremiumButton
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        size="sm"
                      >
                        Send Another Inquiry
                      </PremiumButton>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                          >
                            Full Name &amp; Title
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            placeholder="e.g. Director Elena Vance"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                          >
                            Official Work Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            placeholder="name@agency.gov or name@ngo.org"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="dept"
                          className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                        >
                          Department or Sector
                        </label>
                        <select
                          id="dept"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                        >
                          <option value="Municipal Authority">Municipal Authority / Government Board</option>
                          <option value="Emergency Shelter">Emergency Shelter / Sanctuary Provider</option>
                          <option value="Hospital Clinic">Hospital Clinic / Health Authority</option>
                          <option value="Field Outreach NGO">Field Outreach NGO / Volunteer Corps</option>
                          <option value="Software Integration">Software Integration / GovTech Vendor</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                        >
                          Inquiry Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          required
                          placeholder="e.g. Ward 4 Capacity Onboarding"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                        >
                          Message &amp; Scope
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          required
                          placeholder="Provide operational requirements or technical inquiry details..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                        Transmit Dispatch Inquiry
                      </PremiumButton>
                    </form>
                  )}
                </div>
              </div>

              {/* Right: Contained 3D Visual Panel (Gallery Tunnel Coordination Stream) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="h-[480px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 relative shadow-xl">
                  <GalleryTunnel speedMultiplier={0.7} interactive={true} variant="compact" />
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-[#101D32]/90 border border-white/10 text-[10px] font-mono text-[#35A99A]">
                      LIVE LIAISON STREAM ACTIVE
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E4E8E5] text-xs font-mono text-[#64748B] flex items-center justify-between shadow-sm">
                  <span>ENCRYPTED RELAY: TLS 1.3 // SHA-256</span>
                  <span className="text-[#21845A] font-bold">ONLINE</span>
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
