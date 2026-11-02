import { Forbidden, Unauthorized } from '../../../shared/errors/AppError.js';

// กฎข้อ 1: ต้อง login ผ่าน Google เท่านั้น
export function assertGoogleIdentity(identity) {
  const onlyGoogle =
    identity.provider === 'google' &&
    identity.providers.every((p) => p === 'google');

  if (!onlyGoogle) {
    throw Forbidden('Only Google sign-in is allowed', 'PROVIDER_NOT_ALLOWED');
  }
}

// กฎข้อ 2: ต้องมีโปรไฟล์ และถ้ายังไม่มี role (รออนุมัติ) เข้าได้เฉพาะหน้าที่อนุญาต
export function assertAccountUsable(profile, { allowPending }) {
  if (!profile) {
    throw Unauthorized('User profile not found', 'PROFILE_NOT_FOUND');
  }
  const isPending = !profile.role;
  if (isPending && !allowPending) {
    throw Forbidden('Account is waiting for admin approval', 'ACCOUNT_PENDING');
  }
}