import { NotFound, Conflict } from '../../../shared/errors/AppError.js';

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

// กฎ (สำหรับ admin): คอร์สต้องมีอยู่จริง จะเปิดหรือปิดก็ได้
export function assertCourseExists(course) {
  if (!course) {
    throw NotFound('Course not found', 'COURSE_NOT_FOUND');
  }
}

// กฎ: ผูกได้เฉพาะครูที่มีอยู่จริงและอนุมัติแล้ว
export function assertTeacherAssignable(teacher) {
  if (!teacher) throw NotFound('Teacher not found', 'TEACHER_NOT_FOUND');
  if (!teacher.isApproved) throw Conflict('Teacher is not approved yet', 'TEACHER_NOT_APPROVED');
}

// กฎ: ครูคนเดียวกันอยู่ในคอร์สเดียวกันได้ครั้งเดียว
export function assertNotAssigned(alreadyAssigned) {
  if (alreadyAssigned) throw Conflict('Teacher already assigned to this course', 'ALREADY_ASSIGNED');
}