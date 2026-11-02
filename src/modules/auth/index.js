import { supabaseAdmin } from '../../shared/infrastructure/supabase.js';
import { createSupabaseAuthGateway } from './infrastructure/supabaseAuth.gateway.js';
import { createUserRepository } from './infrastructure/user.repository.js';
import { createAuthService } from './application/auth.service.js';
import { createAccountService } from './application/account.service.js';
import { createAuthMiddleware } from './presentation/auth.middleware.js';
import { createAuthController } from './presentation/auth.controller.js';
import { createAuthRouter } from './presentation/auth.routes.js';
import { ROLES } from './domain/roles.js';

// infrastructure
const authGateway = createSupabaseAuthGateway(supabaseAdmin);
const userRepository = createUserRepository(supabaseAdmin);

// application
const authService = createAuthService({ authGateway, userRepository });
const accountService = createAccountService({ userRepository });

// presentation
const { requireAuth, requireRole } = createAuthMiddleware(authService);
const authController = createAuthController({ accountService });

// public API ของโมดูล
export const authRouter = createAuthRouter({ authController, requireAuth });
export { requireAuth, requireRole, ROLES };