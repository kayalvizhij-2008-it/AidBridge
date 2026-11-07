export interface FeaturePublic {
  title: string;
  body: string;
  tags: string[];
  color: string;
}

export const FEATURES: FeaturePublic[] = [
  {
    title: 'End-to-end referral tracking',
    body: 'From registration through verified service delivery to closure.',
    tags: ['referrals', 'workflow'],
    color: 'bg-blue-500/15 text-blue-300',
  },
  {
    title: 'Multi-stakeholder coordination',
    body: 'Outreach workers, shelters, hospitals, and government departments on one workspace.',
    tags: ['roles', 'network'],
    color: 'bg-teal-500/15 text-teal-300',
  },
  {
    title: 'Verified delivery records',
    body: 'Assistance evidence is recorded and confirmed before cases close.',
    tags: ['verification', 'audit'],
    color: 'bg-emerald-500/15 text-emerald-300',
  },
  {
    title: 'Role-based dashboards',
    body: 'Every action is scoped by role and organisation with audit trails.',
    tags: ['permissions', 'security'],
    color: 'bg-violet-500/15 text-violet-300',
  },
];
