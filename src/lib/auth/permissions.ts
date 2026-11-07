// Static permission matrix mirroring lib/auth/roles.ts
export const PERMISSION_TREE = {
  cases: ['view_cases'],
  registration: ['create_case', 'assess'],
  referrals: ['referral', 'accept_referral', 'reject_referral'],
  delivery: ['verify_delivery'],
  closure: ['close_case'],
  resources: ['manage_resources'],
  analytics: ['view_analytics'],
  audit: ['audit_log'],
  escalation: ['escalate'],
};
