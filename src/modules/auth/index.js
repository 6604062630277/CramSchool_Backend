import { supabaseAdmin } from '../../shared/infrastructure/supabase.js';
import { createSupabaseAuthGateway } from './infrastructure/supabaseAuth.gateway.js';
import { createUserRepository } from './infrastructure/user.repository.js';
import { createAuthService } from './application/auth.service.js';
import { createAccountService } from './application/account.service.js';
import { createAuthMiddleware } from './presentation/auth.middleware.js';
import { createAuthController } from './presentation/auth.controller.js';
import { createAuthRouter } from './presentation/auth.routes.js';
import { createProfileRepository } from './infrastructure/profile.repository.js';
import { ROLES } from './domain/roles.js';

// infrastructure
const authGateway = createSupabaseAuthGateway(supabaseAdmin);
const userRepository = createUserRepository(supabaseAdmin);
const profileRepository = createProfileRepository(supabaseAdmin);

// application
const authService = createAuthService({ authGateway, userRepository });
const accountService = createAccountService({ userRepository, profileRepository });

// presentation
const { requireAuth, requireRole } = createAuthMiddleware(authService);
const authController = createAuthController({ accountService });

// public API ของโมดูล
export const authRouter = createAuthRouter({ authController, requireAuth });
export { requireAuth, requireRole, ROLES };