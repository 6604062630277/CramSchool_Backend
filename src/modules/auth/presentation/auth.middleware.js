import { Forbidden, Unauthorized } from '../../../shared/errors/AppError.js';

export function createAuthMiddleware(authService) {
  // ยามตรวจ token
  function requireAuth({ allowPending = false } = {}) {
    return async (req, res, next) => {
      const header = req.headers.authorization ?? '';
      const [scheme, token] = header.split(' ');

      if (scheme !== 'Bearer' || !token) {
        throw Unauthorized('Missing bearer token', 'MISSING_TOKEN');
      }

      req.user = await authService.authenticate(token, { allowPending });
      next();
    };
  }

  // ยามตรวจ role (RBAC)
  function requireRole(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user?.role)) {
        throw Forbidden('Insufficient role', 'FORBIDDEN_ROLE');
      }
      next();
    };
  }

  return { requireAuth, requireRole };
}