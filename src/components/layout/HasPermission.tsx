'use client';

import type { ReactNode } from 'react';
import { hasPermission, type Permission } from '@/lib/auth/roles';

export function HasPermission({
  role,
  perm,
  children,
  showLabel,
}: {
  role: string;
  perm: Permission;
  children: ReactNode;
  showLabel?: boolean;
}) {
  if (!hasPermission(role, perm)) return null;
  if (!showLabel) return <>{children}</>;
  return <>{children}</>;
}
