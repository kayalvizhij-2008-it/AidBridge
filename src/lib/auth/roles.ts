export type RoleId = 'ROLE_ADMIN' | 'ROLE_OUTREACH' | 'ROLE_SHELTER' | 'ROLE_HOSPITAL' | 'ROLE_MANAGER';

export const ROLES: Record<RoleId, { label: string; color: string; description: string }> = {
  ROLE_ADMIN: {
    label: 'Government Administrator',
    color: '#2b6ccb',
    description: 'System operations, organization governance, audit intelligence, and city-wide performance.',
  },
  ROLE_OUTREACH: {
    label: 'Outreach Worker',
    color: '#0d9488',
    description: 'Field registration, street triage, needs assessment, and immediate intervention referrals.',
  },
  ROLE_SHELTER: {
    label: 'Shelter Coordinator',
    color: '#16a34a',
    description: 'Bed availability tracking, admission/discharge logging, and emergency intake management.',
  },
  ROLE_HOSPITAL: {
    label: 'Hospital Coordinator',
    color: '#0284c7',
    description: 'Medical assistance referrals, clinical triage reviews, and healthcare delivery verification.',
  },
  ROLE_MANAGER: {
    label: 'Case Manager',
    color: '#d97706',
    description: 'Assigned caseload oversight, multi-provider tracking, service verification, and verified closure.',
  },
};

export const ROLE_LIST: RoleId[] = Object.keys(ROLES) as RoleId[];

export type Permission =
  | 'view_cases'
  | 'create_case'
  | 'assess'
  | 'referral'
  | 'accept_referral'
  | 'reject_referral'
  | 'verify_delivery'
  | 'close_case'
  | 'manage_resources'
  | 'audit_log'
  | 'view_analytics'
  | 'escalate';

export function hasPermission(role: string, permission: Permission): boolean {
  switch (permission) {
    case 'view_cases':
      return ['ROLE_ADMIN', 'ROLE_OUTREACH', 'ROLE_SHELTER', 'ROLE_HOSPITAL', 'ROLE_MANAGER'].includes(role);
    case 'create_case':
      return ['ROLE_ADMIN', 'ROLE_OUTREACH'].includes(role);
    case 'assess':
      return ['ROLE_ADMIN', 'ROLE_OUTREACH', 'ROLE_MANAGER'].includes(role);
    case 'referral':
      return ['ROLE_ADMIN', 'ROLE_OUTREACH', 'ROLE_MANAGER'].includes(role);
    case 'accept_referral':
      return ['ROLE_ADMIN', 'ROLE_SHELTER', 'ROLE_HOSPITAL'].includes(role);
    case 'reject_referral':
      return ['ROLE_ADMIN', 'ROLE_SHELTER', 'ROLE_HOSPITAL'].includes(role);
    case 'verify_delivery':
      return ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(role);
    case 'close_case':
      return ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(role);
    case 'manage_resources':
      return ['ROLE_ADMIN', 'ROLE_SHELTER', 'ROLE_HOSPITAL'].includes(role);
    case 'audit_log':
      return ['ROLE_ADMIN'].includes(role);
    case 'view_analytics':
      return ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(role);
    case 'escalate':
      return ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(role);
    default:
      return false;
  }
}
