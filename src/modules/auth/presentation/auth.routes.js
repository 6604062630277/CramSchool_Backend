import { Router } from 'express';
import { validateBody } from '../../../shared/http/validate.js';
import { registerSchema } from './auth.schemas.js';

export function createAuthRouter({ authController, requireAuth }) {
  const router = Router();

  router.get('/auth/me', requireAuth({ allowPending: true }), authController.me);

  router.post(
    '/auth/register',
    requireAuth({ allowPending: true }),
    validateBody(registerSchema),
    authController.register,
  );

  return router;
}