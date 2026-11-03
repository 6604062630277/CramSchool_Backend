import { Router } from 'express';
import { validateBody, validateParams } from '../../../shared/http/validate.js';
import {
  courseIdParamsSchema,
  createCourseSchema,
  updateCourseSchema,
  assignTeacherSchema,
  courseTeacherParamsSchema,
} from './course.schemas.js';

export function createCourseRouter({ courseController, requireAuth, requireRole, ROLES }) {
  const router = Router();
  const adminOnly = [requireAuth(), requireRole(ROLES.ADMIN)];
  const withCourseId = validateParams(courseIdParamsSchema);

  // ---- สาธารณะ ----
  router.get('/courses', courseController.list);
  router.get('/courses/:courseId', withCourseId, courseController.detail);

  // ---- admin ----
  router.get('/admin/courses', ...adminOnly, courseController.adminList);
  router.post('/admin/courses', ...adminOnly, validateBody(createCourseSchema), courseController.create);
  router.get('/admin/courses/:courseId', ...adminOnly, withCourseId, courseController.adminDetail);
  router.patch(
    '/admin/courses/:courseId',
    ...adminOnly,
    withCourseId,
    validateBody(updateCourseSchema),
    courseController.update,
  );

  router.post(
    '/admin/courses/:courseId/teachers',
    ...adminOnly,
    withCourseId,
    validateBody(assignTeacherSchema),
    courseController.assignTeacher,
  );
  
  router.delete(
    '/admin/courses/:courseId/teachers/:teacherId',
    ...adminOnly,
    validateParams(courseTeacherParamsSchema),
    courseController.removeTeacher,
  );

  return router;
}