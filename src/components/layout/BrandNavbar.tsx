'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/services', label: 'Services' },
  { href: '/network', label: 'Network' },
  { href: '/impact', label: 'Impact' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function BrandNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#101D32] border border-[#E4E8E5]/15 px-5 py-3 shadow-lg flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3.5 select-none">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#176B67] via-[#35A99A] to-[#D8B77A] p-[1.5px] shadow-sm hover:scale-105 transition-transform duration-200">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#101D32]">
              <ShieldCheck className="h-5 w-5 text-[#35A99A] group-hover:rotate-6 transition-transform duration-200" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D8B77A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D8B77A]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#35A99A] transition-colors">
                AidBridge
              </span>
              <span className="rounded-full bg-[#D8B77A]/15 border border-[#D8B77A]/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#D8B77A]">
                GOVTECH
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wider text-[#F5F3EC]/70">
              Connecting Every Need. Ensuring Every Care.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#182B49]/70 p-1.5 rounded-xl border border-white/5">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#176B67] shadow-sm'
                    : 'text-[#F5F3EC]/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 rounded-full border border-[#35A99A]/40 bg-[#35A99A]/15 px-3 py-1 text-xs text-[#35A99A] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#35A99A] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#35A99A]"></span>
            </span>
            <span>VERIFIED NETWORK</span>
          </div>

          <Link
            href="/login"
            className="px-3.5 py-2 text-sm font-medium text-[#F5F3EC]/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>

          <PremiumButton
            href="/login"
            variant="primary"
            size="sm"
            withArrow
          >
            Access Platform
          </PremiumButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <PremiumButton href="/login" variant="primary" size="sm">
            Sign In
          </PremiumButton>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#182B49] border border-white/10 text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mt-2 mx-auto max-w-7xl rounded-2xl bg-[#101D32] border border-[#E4E8E5]/20 p-5 shadow-2xl lg:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-[#176B67] text-white'
                    : 'text-[#F5F3EC]/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <PremiumButton
                href="/login"
                variant="primary"
                size="md"
                withArrow
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Access Platform (Dashboards)
              </PremiumButton>
              <PremiumButton
                href="/register"
                variant="outline"
                size="md"
                className="w-full text-white border-white/20 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register Partner Organization
              </PremiumButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default BrandNavbar;
