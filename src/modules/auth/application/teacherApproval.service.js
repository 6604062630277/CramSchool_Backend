import { ROLES } from '../domain/roles.js';
import { assertPendingApproval } from '../domain/account.rules.js';

export function createTeacherApprovalService({ userRepository, profileRepository, accountService }) {
  async function listPending() {
    const usersWithoutRole = await userRepository.listWithoutRole();
    const applications = await profileRepository.findTeachersByUserIds(
      usersWithoutRole.map((u) => u.id),
    );

    // เก็บเฉพาะคนที่มีใบสมัครครู แล้วรวมข้อมูลสองตารางเข้าด้วยกัน
    return applications.map((app) => ({
      ...usersWithoutRole.find((u) => u.id === app.userId),
      teacher: app,
    }));
  }

  async function approve(userId) {
    const user = await accountService.getMe(userId);
    assertPendingApproval(user.status);

    await userRepository.updateRole(userId, ROLES.TEACHER);
    return accountService.getMe(userId);
  }

  async function reject(userId) {
    const user = await accountService.getMe(userId);
    assertPendingApproval(user.status);

    await profileRepository.deleteTeacher(userId);
    return accountService.getMe(userId);
  }

  return { listPending, approve, reject };
}