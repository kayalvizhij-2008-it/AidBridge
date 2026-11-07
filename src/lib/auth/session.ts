import { getServerSession } from 'next-auth';
import { authConfig } from './auth';
import type { RoleId, Permission } from './roles';
import { hasPermission } from './roles';

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: RoleId;
  orgId: string;
  orgName?: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authConfig);
  if (!session?.user) return null;
  return {
    userId: (session.user as any).id ?? '',
    name: (session.user as any).name ?? '',
    email: (session.user as any).email ?? '',
    role: ((session.user as any).role as RoleId) ?? 'ROLE_OUTREACH',
    orgId: (session.user as any).orgId ?? '',
    orgName: (session.user as any).orgName ?? '',
  };
}

export async function getUserPermissions(role: string): Promise<string[]> {
  const allPermissions: Permission[] = [
    'view_cases',
    'create_case',
    'assess',
    'referral',
    'accept_referral',
    'reject_referral',
    'verify_delivery',
    'close_case',
    'manage_resources',
    'audit_log',
    'view_analytics',
    'escalate',
  ];
  return allPermissions.filter((p) => hasPermission(role, p));
}
