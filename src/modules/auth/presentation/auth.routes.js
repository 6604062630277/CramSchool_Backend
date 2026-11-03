import { Router } from 'express';
import { validateBody, validateParams } from '../../../shared/http/validate.js';
import { registerSchema, userIdParamsSchema } from './auth.schemas.js';
import { ROLES } from '../domain/roles.js';

export function createAuthRouter({ authController, adminController, requireAuth, requireRole }) {
  const router = Router();
  const adminOnly = [requireAuth(), requireRole(ROLES.ADMIN)];

  // ---- ผู้ใช้ทั่วไป ----
  router.get('/auth/me', requireAuth({ allowPending: true }), authController.me);

  router.post(
    '/auth/register',
    requireAuth({ allowPending: true }),
    validateBody(registerSchema),
    authController.register,
  );

  // ---- admin ----
  router.get('/admin/teachers/pending', ...adminOnly, adminController.listPendingTeachers);

  router.post(
    '/admin/teachers/:userId/approve',
    ...adminOnly,
    validateParams(userIdParamsSchema),
    adminController.approveTeacher,
  );

  router.post(
    '/admin/teachers/:userId/reject',
    ...adminOnly,
    validateParams(userIdParamsSchema),
    adminController.rejectTeacher,
  );

  return router;
}