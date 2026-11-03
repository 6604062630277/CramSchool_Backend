import { assertCourseOpen } from '../domain/course.rules.js';

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

  return { listOpen, listAll, getOpen };
}