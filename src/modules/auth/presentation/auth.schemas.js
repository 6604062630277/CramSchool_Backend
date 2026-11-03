import { z } from 'zod';
import { ROLES } from '../domain/roles.js';

// ฟอร์มมักส่ง '' มาเวลาไม่ได้กรอก -> แปลงให้เป็น "ไม่ได้ส่งมา"
const blankable = (schema) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

const text = (max) => z.string().trim().min(1, 'กรุณากรอกข้อมูล').max(max);

const addressSchema = z.object({
  addressLine: blankable(z.string().trim().max(500)),
  subdistrict: blankable(z.string().trim().max(100)),
  district: blankable(z.string().trim().max(100)),
  province: blankable(z.string().trim().max(100)),
  postalCode: blankable(z.string().trim().regex(/^\d{5}$/, 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก')),
});

const studentSchema = z.object({
  nickname: text(50),
  birthDate: blankable(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ต้องเป็น YYYY-MM-DD')),
  schoolName: blankable(z.string().trim().max(150)),
  gradeLevel: blankable(z.string().trim().max(100)),
});

const teacherSchema = z.object({
  workplaceName: blankable(z.string().trim().max(100)),
  bankName: blankable(z.string().trim().max(50)),
  bankAccountName: blankable(z.string().trim().max(100)),
  bankAccountNumber: blankable(z.string().trim().regex(/^\d{10,15}$/, 'เลขบัญชีต้องเป็นตัวเลข 10-15 หลัก')),
  promptpayNumber: blankable(z.string().trim().regex(/^\d{10,13}$/, 'พร้อมเพย์ต้องเป็นตัวเลข 10-13 หลัก')),
});

export const registerSchema = z
  .object({
    role: z.enum([ROLES.STUDENT, ROLES.PARENT, ROLES.TEACHER]),
    profileName: text(50),
    firstName: text(100),
    lastName: text(100),
    phoneNumber: z.string().trim().regex(/^0\d{8,9}$/, 'เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0'),
    address: addressSchema.optional(),
    student: studentSchema.optional(),
    teacher: teacherSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === ROLES.STUDENT && !data.student) {
      ctx.addIssue({ code: 'custom', path: ['student'], message: 'ต้องกรอกข้อมูลนักเรียน' });
    }
    if (data.role === ROLES.TEACHER && !data.teacher) {
      ctx.addIssue({ code: 'custom', path: ['teacher'], message: 'ต้องกรอกข้อมูลครู' });
    }
  });