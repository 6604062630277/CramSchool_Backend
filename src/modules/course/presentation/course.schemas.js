import { z } from 'zod';

export const courseIdParamsSchema = z.object({
  courseId: z.string().uuid('courseId ต้องเป็น UUID'),
});