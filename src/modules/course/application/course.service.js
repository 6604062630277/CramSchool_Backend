import {
  assertCourseOpen,
  assertCourseExists,
  assertTeacherAssignable,
  assertNotAssigned,
} from '../domain/course.rules.js';

export function createCourseService({ courseRepository, courseTeacherRepository, teacherDirectory }) {
  // เติมรายชื่อครูให้คอร์ส
  async function withTeachers(course) {
    const teacherIds = await courseTeacherRepository.listTeacherIds(course.id);
    const teachers = await teacherDirectory.getByTeacherIds(teacherIds);
    return { ...course, teachers };
  }

  async function listOpen() {
    return courseRepository.list({ includeInactive: false });
  }

  async function listAll() {
    return courseRepository.list({ includeInactive: true });
  }

  async function getOpen(courseId) {
    const course = await courseRepository.findById(courseId);
    assertCourseOpen(course);
    return withTeachers(course);
  }

  async function getAny(courseId) {
    const course = await courseRepository.findById(courseId);
    assertCourseExists(course);
    return withTeachers(course);
  }
  
  async function create({ teacherIds = [], ...input }) {
    const uniqueIds = [...new Set(teacherIds)];

    // 1) ตรวจครูทุกคนก่อน ถ้าไม่ผ่านจะไม่สร้างคอร์สเลย
    const teachers = await teacherDirectory.getByTeacherIds(uniqueIds);
    for (const teacherId of uniqueIds) {
      assertTeacherAssignable(teachers.find((t) => t.teacherId === teacherId));
    }

    // 2) สร้างคอร์ส
    const course = await courseRepository.create({ ...input, isActive: input.isActive ?? true });

    // 3) ผูกครู
    for (const teacherId of uniqueIds) {
      await courseTeacherRepository.add(course.id, teacherId);
    }

    return getAny(course.id);
  }

  async function update(courseId, patch) {
    const course = await courseRepository.update(courseId, patch);
    assertCourseExists(course);
    return course;
  }

  async function assignTeacher(courseId, teacherId) {
    assertCourseExists(await courseRepository.findById(courseId));

    const [teacher] = await teacherDirectory.getByTeacherIds([teacherId]);
    assertTeacherAssignable(teacher);
    assertNotAssigned(await courseTeacherRepository.exists(courseId, teacherId));

    await courseTeacherRepository.add(courseId, teacherId);
    return getAny(courseId);
  }

  async function removeTeacher(courseId, teacherId) {
    assertCourseExists(await courseRepository.findById(courseId));
    await courseTeacherRepository.remove(courseId, teacherId);
    return getAny(courseId);
  }

  return { listOpen, listAll, getOpen, getAny, create, update, assignTeacher, removeTeacher };
}