'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Users,
  Home as HomeIcon,
  HeartPulse,
  Compass,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { GalleryTunnel } from '@/components/3d/GalleryTunnel';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { BrandFooter } from '@/components/layout/BrandFooter';
import { Badge } from '@/components/ui/badge';

const DEMO_ROLES = [
  {
    role: 'ROLE_ADMIN',
    title: 'Government Administrator',
    name: 'Director Elena Vance',
    email: 'admin@aidbridge.local',
    icon: <ShieldCheck className="h-4 w-4 text-[#176B67]" />,
    dest: '/dashboard/admin',
    desc: 'Oversight, agency governance, unalterable audit trails',
  },
  {
    role: 'ROLE_OUTREACH',
    title: 'Outreach Worker',
    name: 'Marcus Chen',
    email: 'outreach@aidbridge.local',
    icon: <Compass className="h-4 w-4 text-[#176B67]" />,
    dest: '/dashboard/outreach',
    desc: 'Street intake, needs triage matrix, urgent referrals',
  },
  {
    role: 'ROLE_SHELTER',
    title: 'Shelter Coordinator',
    name: 'Sarah Jenkins',
    email: 'shelter@aidbridge.local',
    icon: <HomeIcon className="h-4 w-4 text-[#176B67]" />,
    dest: '/dashboard/shelter',
    desc: 'Live bed counter, admissions roster, delivery proofs',
  },
  {
    role: 'ROLE_HOSPITAL',
    title: 'Hospital Coordinator',
    name: 'Dr. Tariq Mahmood',
    email: 'hospital@aidbridge.local',
    icon: <HeartPulse className="h-4 w-4 text-[#176B67]" />,
    dest: '/dashboard/hospital',
    desc: 'Acute clinical care, psychiatric triage, medical discharge',
  },
  {
    role: 'ROLE_MANAGER',
    title: 'Case Manager',
    name: 'Amara Patel',
    email: 'manager@aidbridge.local',
    icon: <Users className="h-4 w-4 text-[#176B67]" />,
    dest: '/dashboard/manager',
    desc: 'Delivery verification desk, follow-ups, guarded closure',
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: loginEmail,
        password: loginPass,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMsg('Invalid credentials. Please verify your email and password or use the evaluator buttons.');
        setLoading(false);
      } else {
        const selectedDemo = DEMO_ROLES.find(
          (d) => d.email.toLowerCase() === loginEmail.toLowerCase()
        );
        const targetUrl = selectedDemo ? selectedDemo.dest : callbackUrl;
        router.push(targetUrl);
        router.refresh();
      }
    } catch {
      setErrorMsg('An unexpected authentication error occurred.');
      setLoading(false);
    }
  };

  const selectDemoRole = (roleItem: typeof DEMO_ROLES[0]) => {
    setEmail(roleItem.email);
    setPassword('AidBridge2026!');
    handleLogin(undefined, roleItem.email, 'AidBridge2026!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EC] text-[#182536] relative">
      {/* Top Simple Brand Bar in Midnight Navy */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[#E4E8E5]/15 bg-[#101D32] text-white">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#176B67] text-white p-[1px] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#D8B77A]" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-none">
              AidBridge
            </span>
            <span className="text-[10px] font-mono text-[#D8B77A] uppercase tracking-widest block -mt-0.5">
              GovTech Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#F5F3EC]/70 hidden sm:inline font-mono">Need agency credentials?</span>
          <Link
            href="/register"
            className="text-xs font-mono text-[#35A99A] hover:text-white transition-colors border border-[#35A99A]/30 px-3 py-1.5 rounded-lg bg-[#182B49]"
          >
            Request Access
          </Link>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Auth Form on Pure White Card */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#E4E8E5] shadow-card">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F0] px-3 py-1 text-[11px] font-mono text-[#176B67] border border-[#176B67]/20 mb-2">
                  <Lock className="w-3 h-3 text-[#176B67]" />
                  <span>SECURE DESK AUTHENTICATION</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#182536] tracking-tight">
                  Sign In to Workspace
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                  Access authorized agency desks or evaluate any role below.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#C94C4C]/30 bg-[#C94C4C]/10 p-3.5 text-xs text-[#C94C4C]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono font-medium text-[#182536] mb-1.5 uppercase tracking-wider"
                  >
                    Authorized Work Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@aidbridge.local"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-mono font-medium text-[#182536] uppercase tracking-wider"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E8E5] text-[#182536] placeholder-[#64748B]/60 text-sm focus:outline-none focus:border-[#176B67] focus:ring-1 focus:ring-[#176B67] transition-all font-sans pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#182536]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <PremiumButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  withArrow
                  className="w-full mt-2"
                >
                  Sign In to Desk
                </PremiumButton>
              </form>

              {/* Quick 1-Click Role Switcher */}
              <div className="mt-8 pt-6 border-t border-[#E4E8E5]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#182536] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#176B67]" />
                    <span>Authorized Evaluator Quick-Access</span>
                  </span>
                  <Badge variant="champagne" className="text-[10px]">
                    DEMO ACCESS
                  </Badge>
                </div>

                <div className="space-y-2">
                  {DEMO_ROLES.map((roleItem) => (
                    <button
                      key={roleItem.role}
                      type="button"
                      onClick={() => selectDemoRole(roleItem)}
                      disabled={loading}
                      className="flex w-full items-center justify-between rounded-xl border border-[#E4E8E5] bg-[#F5F3EC] p-2.5 text-left transition-all hover:border-[#176B67] hover:bg-[#E8F3F0] active:scale-[0.99] disabled:opacity-50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white p-2 border border-[#E4E8E5] group-hover:border-[#176B67] transition-colors">
                          {roleItem.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#182536] group-hover:text-[#176B67] transition-colors">
                            {roleItem.title}
                          </p>
                          <p className="text-[11px] text-[#64748B]">{roleItem.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#176B67] font-semibold hidden sm:inline">
                          Select Role
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#64748B] group-hover:translate-x-1 group-hover:text-[#176B67] transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contained 3D Visual Panel (Gallery Tunnel Corridor) */}
          <div className="lg:col-span-6 hidden lg:block space-y-4">
            <div className="h-[580px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/30 shadow-xl relative">
              <GalleryTunnel speedMultiplier={0.7} interactive={true} variant="compact" />
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-[#101D32]/90 border border-white/10 text-[10px] font-mono text-[#35A99A]">
                  GOVTECH GATEWAY // VERIFIED PROTOCOLS
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E4E8E5] flex items-center justify-between text-xs font-mono text-[#64748B] shadow-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#21845A] animate-pulse" />
                <span>ACTIVE CARE NETWORK PROTOCOL</span>
              </span>
              <span className="text-[#182536] font-bold">v4.2 CERTIFIED</span>
            </div>
          </div>
        </div>
      </main>

      <BrandFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F3EC] flex items-center justify-center text-[#176B67] font-mono text-xs">
          AUTHENTICATING AIDBRIDGE WORKSPACE...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
