'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  ShieldCheck,
  LogOut,
  Bell,
  Building2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { RoleId } from '@/lib/auth/roles';
import { ROLES } from '@/lib/auth/roles';

interface Props {
  user: {
    userId: string;
    name: string;
    email: string;
    role: RoleId;
    orgId: string;
    orgName?: string;
  };
  unreadCount?: number;
}

export function DashboardHeader({ user, unreadCount = 2 }: Props) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  const roleInfo = ROLES[user.role] ?? {
    label: user.role,
    color: '#176B67',
    description: '',
  };

  const dashboardLinks = [
    { href: '/dashboard/admin', label: 'Admin', role: 'ROLE_ADMIN' },
    { href: '/dashboard/outreach', label: 'Outreach', role: 'ROLE_OUTREACH' },
    { href: '/dashboard/shelter', label: 'Shelter', role: 'ROLE_SHELTER' },
    { href: '/dashboard/hospital', label: 'Hospital', role: 'ROLE_HOSPITAL' },
    { href: '/dashboard/manager', label: 'Case Manager', role: 'ROLE_MANAGER' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-2.5 pb-2">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#101D32] border border-[#E4E8E5]/15 px-5 py-2.5 shadow-md flex items-center justify-between">
        {/* Left: Brand + Org Context */}
        <div className="flex items-center gap-5">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#176B67] text-white p-[1px] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#D8B77A] group-hover:rotate-6 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-[#35A99A] transition-colors">
                AidBridge
              </span>
              <span className="text-[10px] font-mono text-[#D8B77A] -mt-0.5">OPS DESK</span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
            <Building2 className="h-3.5 w-3.5 text-[#F5F3EC]/50" />
            <span className="text-xs text-[#F5F3EC]/80 font-mono truncate max-w-[200px]">
              {user.orgName || 'Metropolitan Care Network'}
            </span>
          </div>
        </div>

        {/* Center: Role Switcher Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#182B49] p-1 rounded-xl border border-white/5">
          {dashboardLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#176B67] shadow-sm'
                    : 'text-[#F5F3EC]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Notifications + User Badge */}
        <div className="flex items-center gap-3">
          {/* Notification Popover */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#182B49] border border-white/10 text-[#F5F3EC]/80 hover:text-white hover:border-[#35A99A]/40 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D8B77A] text-[10px] font-bold text-[#101D32] font-mono">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#101D32] border border-[#E4E8E5]/20 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#D8B77A]" />
                    <span>Real-time Operational Alerts</span>
                  </span>
                  <span className="rounded-full bg-[#35A99A]/15 border border-[#35A99A]/30 px-2 py-0.5 text-[9px] font-mono text-[#35A99A]">
                    LIVE
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-xl bg-[#182B49] p-3 border border-white/10">
                    <p className="font-bold text-white">Delivery Verification Pending</p>
                    <p className="mt-0.5 text-[11px] text-[#F5F3EC]/70 leading-relaxed">
                      Shelter intake recorded for Maya S. Awaiting supervisor verification before closure.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#182B49] p-3 border border-[#D49A35]/30">
                    <p className="font-bold text-[#D49A35]">Overdue Follow-up Escalation</p>
                    <p className="mt-0.5 text-[11px] text-[#F5F3EC]/70 leading-relaxed">
                      Hospital clinical discharge recorded. Outreach team scheduled for 14-day touchpoint.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile + Logout */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <span className="text-[10px] font-mono text-[#35A99A]">{roleInfo.label}</span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex h-9 items-center gap-1.5 px-3 rounded-xl bg-[#182B49] border border-white/10 text-xs font-medium text-[#F5F3EC]/80 hover:text-[#C94C4C] hover:border-[#C94C4C]/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
