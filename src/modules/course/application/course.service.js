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

  async function create(input) {
    return courseRepository.create({ ...input, isActive: input.isActive ?? true });
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