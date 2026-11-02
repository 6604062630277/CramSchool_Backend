import { supabaseAdmin } from './src/shared/infrastructure/supabase.js';
import { createSupabaseAuthGateway } from './src/modules/auth/infrastructure/supabaseAuth.gateway.js';
import { createUserRepository } from './src/modules/auth/infrastructure/user.repository.js';
import { createAuthService } from './src/modules/auth/application/auth.service.js';

// ประกอบชิ้นส่วนเข้าด้วยกัน
const authService = createAuthService({
  authGateway: createSupabaseAuthGateway(supabaseAdmin),
  userRepository: createUserRepository(supabaseAdmin),
});

const token = process.argv[2];

async function test(name, fn) {
  try {
    console.log('✅', name, await fn());
  } catch (e) {
    console.log('⛔', name, e.statusCode, e.code);
  }
}

await test('หน้าทั่วไป', () => authService.authenticate(token));
await test('/auth/me  ', () => authService.authenticate(token, { allowPending: true }));
await test('token ปลอม', () => authService.authenticate('abc123'));