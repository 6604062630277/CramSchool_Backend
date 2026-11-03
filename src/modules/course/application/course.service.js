import { assertCourseOpen, assertCourseExists } from '../domain/course.rules.js';

export function createCourseService({ courseRepository }) {
  async function listOpen() {
    return courseRepository.list({ includeInactive: false });
  }

  async function listAll() {
    return courseRepository.list({ includeInactive: true });
  }

  async function getOpen(courseId) {
    const course = await courseRepository.findById(courseId);
    assertCourseOpen(course);
    return course;
  }

  async function getAny(courseId) {
    const course = await courseRepository.findById(courseId);
    assertCourseExists(course);
    return course;
  }

  async function create(input) {
    // คอร์สใหม่เปิดรับสมัครเป็นค่าเริ่มต้น
    return courseRepository.create({ ...input, isActive: input.isActive ?? true });
  }

  async function update(courseId, patch) {
    const course = await courseRepository.update(courseId, patch);
    assertCourseExists(course);
    return course;
  }

  return { listOpen, listAll, getOpen, getAny, create, update };
}