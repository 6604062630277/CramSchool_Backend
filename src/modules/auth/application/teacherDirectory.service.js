import { ROLES } from '../domain/roles.js';

// ข้อมูลครูแบบย่อที่ส่งให้โมดูลอื่น (ไม่มีข้อมูลธนาคาร)
function toTeacherSummary(user, teacher) {
  return {
    teacherId: teacher.teacherId,
    userId: user.id,
    name: user.profileName || user.fullName || user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    isApproved: user.role === ROLES.TEACHER,
  };
}

export function createTeacherDirectoryService({ userRepository, profileRepository }) {
  // ครูที่อนุมัติแล้วทั้งหมด
  async function listApproved() {
    const { items: users } = await userRepository.listUsers({
      role: ROLES.TEACHER,
      limit: 1000,
      offset: 0,
    });
    const teachers = await profileRepository.findTeachersByUserIds(users.map((u) => u.id));
    return teachers.map((t) => toTeacherSummary(users.find((u) => u.id === t.userId), t));
  }

  // หาข้อมูลครูจาก TeacherID หลายคนพร้อมกัน
  async function getByTeacherIds(teacherIds) {
    const teachers = await profileRepository.findTeachersByTeacherIds(teacherIds);
    const users = await userRepository.findByIds(teachers.map((t) => t.userId));

    return teachers
      .map((t) => {
        const user = users.find((u) => u.id === t.userId);
        return user ? toTeacherSummary(user, t) : null;
      })
      .filter(Boolean);
  }

  return { listApproved, getByTeacherIds };
}