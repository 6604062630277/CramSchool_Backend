import { Unauthorized } from '../../../shared/errors/AppError.js';
import { assertGoogleIdentity, assertAccountUsable } from '../domain/auth.rules.js';

export function createAuthService({ authGateway, userRepository }) {
  return {
    async authenticate(accessToken, { allowPending = false } = {}) {
      // 1) token นี้ของใคร
      const identity = await authGateway.verifyAccessToken(accessToken);
      if (!identity) {
        throw Unauthorized('Invalid or expired token', 'INVALID_TOKEN');
      }

      // 2) ต้องเป็น Google เท่านั้น
      assertGoogleIdentity(identity);

      // 3) หาโปรไฟล์ ถ้ายังไม่มี (login ครั้งแรก) ให้สร้าง
      let profile = await userRepository.findById(identity.id);
      if (!profile) {
        profile = await userRepository.createIfMissing(identity);
      }

      // 4) ต้องมี role แล้ว (ยกเว้นหน้าที่อนุญาตคนรออนุมัติ)
      assertAccountUsable(profile, { allowPending });

      // 5) ข้อมูลผู้ใช้ที่จะแนบไปกับ request
      return { id: profile.id, email: identity.email, role: profile.role };
    },
  };
}