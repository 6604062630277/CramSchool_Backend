import { Router } from 'express';

export function createAuthRouter({ authController, requireAuth }) {
  const router = Router();

  router.get('/auth/me', requireAuth({ allowPending: true }), authController.me);

  return router;
}