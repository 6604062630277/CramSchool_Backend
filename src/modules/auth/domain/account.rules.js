export const ACCOUNT_STATUS = Object.freeze({
  NEEDS_REGISTRATION: 'needs_registration',
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
});

export function getAccountStatus({ role, hasTeacherApplication }) {
  if (role) return ACCOUNT_STATUS.ACTIVE;
  if (hasTeacherApplication) return ACCOUNT_STATUS.PENDING_APPROVAL;
  return ACCOUNT_STATUS.NEEDS_REGISTRATION;
}