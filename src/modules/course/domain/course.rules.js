import { NotFound } from '../../../shared/errors/AppError.js';

// ต้องตรงกับ enum "Course_type" ใน DB
export const COURSE_TYPES = Object.freeze({
  PRIVATE: 'Private',
  GROUP: 'Group',
  BOTH: 'Both',
});

// กฎ: คนทั่วไปเห็นได้เฉพาะคอร์สที่เปิดรับสมัคร
export function assertCourseOpen(course) {
  if (!course || !course.isActive) {
    throw NotFound('Course not found', 'COURSE_NOT_FOUND');
  }
}