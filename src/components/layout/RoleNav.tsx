'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HasPermission } from './HasPermission';

interface Props { role: string }

export function RoleNav({ role }: Props) {
  const pathname = usePathname();
  const base = '/dashboard';
  const links = [
    { href: `${base}/admin`, label: 'Operations', icon: '📊' },
    { href: `${base}/outreach`, label: 'My Outreach', icon: '🤝' },
    { href: `${base}/shelter`, label: 'Shelter Ops', icon: '🏠' },
    { href: `${base}/hospital`, label: 'Health Coord.', icon: '⚕️' },
    { href: `${base}/manager`, label: 'Case Mgmt', icon: '🎯' },
  ];

  return (
    <div className="mb-6">
      <ul className="grid grid-cols-2 gap-x-8 gap-y-1 md:grid-cols-3 lg:grid-cols-5">
        {links.map((link) => {
          const active = pathname.includes(link.href);
          const show = (role === 'ROLE_ADMIN' && link.href === `${base}/admin`)
            || (role === 'ROLE_OUTREACH' && link.href === `${base}/outreach`)
            || (role === 'ROLE_SHELTER' && link.href === `${base}/shelter`)
            || (role === 'ROLE_HOSPITAL' && link.href === `${base}/hospital`)
            || (role === 'ROLE_MANAGER' && link.href === `${base}/manager`);
          if (!show) return null;
          return (
            <li key={link.href}>
              <Button asChild variant={active ? 'default' : 'ghost'} size="sm" className={active ? 'shadow-glow' : ''}>
                <Link href={link.href}>
                  <span className="mr-1.5 inline-block text-lg leading-none">{link.icon}</span>
                  {link.label}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
      <HasPermission role={role} perm="audit_log" showLabel>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
          <Badge variant="champagne">Demonstration Environment</Badge>
          <span>Role credentials securely evaluated server-side. Dual-key closure verification active.</span>
        </div>
      </HasPermission>
    </div>
  );
}
