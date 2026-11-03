export function createUserAdminService({ userRepository, profileRepository }) {
  async function listUsers({ role, search, page, pageSize }) {
    const offset = (page - 1) * pageSize;
    const { items, total } = await userRepository.listUsers({
      role,
      search,
      limit: pageSize,
      offset,
    });

    // เติมข้อมูลนักเรียน (ชั้นปี ฯลฯ) ให้คนที่เป็นนักเรียน
    const students = await profileRepository.findStudentsByUserIds(items.map((u) => u.id));
    const itemsWithStudent = items.map((u) => ({
      ...u,
      student: students.find((s) => s.userId === u.id) ?? null,
    }));

    return {
      items: itemsWithStudent,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  return { listUsers };
}