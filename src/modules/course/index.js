import { supabaseAdmin } from '../../shared/infrastructure/supabase.js';
import { requireAuth, requireRole, ROLES } from '../auth/index.js';   // ← ใช้ของโมดูลอื่น

import { createCourseRepository } from './infrastructure/course.repository.js';
import { createCourseService } from './application/course.service.js';
import { createCourseController } from './presentation/course.controller.js';
import { createCourseRouter } from './presentation/course.routes.js';

// infrastructure
const courseRepository = createCourseRepository(supabaseAdmin);

// application
const courseService = createCourseService({ courseRepository });

// presentation
const courseController = createCourseController({ courseService });

// public API ของโมดูล
export const courseRouter = createCourseRouter({
  courseController,
  requireAuth,
  requireRole,
  ROLES,
});