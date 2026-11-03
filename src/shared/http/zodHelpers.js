import { z } from 'zod';

// '' -> null (ลบค่าออก) / ไม่ส่งมา -> undefined (ไม่แตะค่าเดิม)
export const nullableField = (schema) =>
  z.preprocess((v) => (v === '' ? null : v), schema.nullable().optional());