import { ROLES } from '../domain/roles.js';
import { NotFound } from '../../../shared/errors/AppError.js';
import {
  getAccountStatus,
  assertCanRegister,
  roleAfterRegistration,
  buildFullName,
} from '../domain/account.rules.js';

export function createAccountService({ userRepository, profileRepository }) {
  async function getMe(userId) {
    const profile = await userRepository.findById(userId);
    if (!profile) throw NotFound('User not found', 'USER_NOT_FOUND');
    const hasTeacherApplication =
      !profile.role && (await userRepository.hasTeacherRecord(userId));

    return {
      ...profile,
      status: getAccountStatus({ role: profile.role, hasTeacherApplication }),
    };
  }

  async function register(userId, input) {
    // 1) สมัครได้ครั้งเดียว
    const current = await getMe(userId);
    assertCanRegister(current.status);

    // 2) ข้อมูลเสริม (ทำซ้ำได้ ไม่เปลี่ยนสถานะ)
    if (input.address) {
      await profileRepository.saveAddress(userId, input.address);
    }
    if (input.role === ROLES.STUDENT) {
      await profileRepository.saveStudent(userId, input.student);
    }

    // 3) โปรไฟล์หลัก (นักเรียน/ผู้ปกครองจะได้ role ตรงนี้ -> active)
    await userRepository.updateProfile(userId, {
      profileName: input.profileName,
      fullName: buildFullName(input.firstName, input.lastName),
      phoneNumber: input.phoneNumber,
      role: roleAfterRegistration(input.role),
    });

    // 4) ครู: ใบสมัครเป็นขั้นสุดท้าย (-> pending_approval)
    if (input.role === ROLES.TEACHER) {
      await profileRepository.saveTeacher(userId, input.teacher);
    }

    // ตอบกลับรูปแบบเดียวกับ /auth/me
    return getMe(userId);
  }

  return { getMe, register };
}