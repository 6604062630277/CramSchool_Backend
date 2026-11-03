import { z } from 'zod';
import { nullableField } from '../../../shared/http/zodHelpers.js';
import { COURSE_TYPES } from '../domain/course.rules.js';

export const courseIdParamsSchema = z.object({
  courseId: z.string().uuid('courseId ต้องเป็น UUID'),
});

const courseFields = {
  courseName: z.string().trim().min(1, 'กรุณากรอกชื่อวิชา').max(255),
  description: nullableField(z.string().trim().max(5000)),
  courseType: nullableField(z.enum(Object.values(COURSE_TYPES))),
  totalHours: nullableField(z.coerce.number().int('ชั่วโมงเรียนต้องเป็นจำนวนเต็ม').min(1, 'ชั่วโมงเรียนต้องมากกว่า 0').max(1000)),
  price: nullableField(z.coerce.number().min(0, 'ราคาต้องไม่ติดลบ').max(1000000)),
  maxStudents: nullableField(z.coerce.number().int().min(1, 'จำนวนนักเรียนต้องมากกว่า 0').max(100)),
  isActive: z.boolean().optional(),
};

// สร้าง: ต้องมีชื่อวิชา ช่องอื่นไม่บังคับ
export const createCourseSchema = z.object(courseFields);

// แก้ไข: ทุกช่องไม่บังคับ แต่ต้องส่งมาอย่างน้อย 1 ช่อง
export const updateCourseSchema = z
  .object(courseFields)
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'ต้องส่งข้อมูลที่จะแก้อย่างน้อย 1 ช่อง');

export const assignTeacherSchema = z.object({
  teacherId: z.string().uuid('teacherId ต้องเป็น UUID'),
});

export const courseTeacherParamsSchema = z.object({
  courseId: z.string().uuid('courseId ต้องเป็น UUID'),
  teacherId: z.string().uuid('teacherId ต้องเป็น UUID'),
});