import { Router } from 'express';
import { validateParams } from '../../../shared/http/validate.js';
import { courseIdParamsSchema } from './course.schemas.js';

export function createCourseRouter({ courseController, requireAuth, requireRole, ROLES }) {
  const router = Router();
  const adminOnly = [requireAuth(), requireRole(ROLES.ADMIN)];

  // ---- สาธารณะ ----
  router.get('/courses', courseController.list);
  router.get('/courses/:courseId', validateParams(courseIdParamsSchema), courseController.detail);

  // ---- admin ----
  router.get('/admin/courses', ...adminOnly, courseController.adminList);

  return router;
}