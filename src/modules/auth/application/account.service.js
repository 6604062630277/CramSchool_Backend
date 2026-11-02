import { getAccountStatus } from '../domain/account.rules.js';

export function createAccountService({ userRepository }) {
  return {
    async getMe(userId) {
      const profile = await userRepository.findById(userId);

      // เช็กตาราง Teachers เฉพาะคนที่ยังไม่มี role
      const hasTeacherApplication =
        !profile.role && (await userRepository.hasTeacherRecord(userId));

      return {
        ...profile,
        status: getAccountStatus({ role: profile.role, hasTeacherApplication }),
      };
    },
  };
}