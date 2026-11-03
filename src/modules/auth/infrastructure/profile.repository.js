import { randomUUID } from 'node:crypto';
import { dbError } from '../../../shared/infrastructure/dbError.js';

export function createProfileRepository(supabase) {
  // ถ้ามีแถวของ user นี้แล้ว -> แก้ไข / ถ้ายังไม่มี -> สร้างใหม่
  async function saveByUserId(table, idColumn, userId, values, extraOnInsert = {}) {
    const { data: existing, error: findError } = await supabase
      .from(table)
      .select(idColumn)
      .eq('UserID', userId)
      .limit(1);

    if (findError) throw dbError(findError);

    if (existing.length > 0) {
      const { error } = await supabase
        .from(table)
        .update(values)
        .eq(idColumn, existing[0][idColumn]);
      if (error) throw dbError(error);
    } else {
      const { error } = await supabase
        .from(table)
        .insert({ [idColumn]: randomUUID(), UserID: userId, ...values, ...extraOnInsert });
      if (error) throw dbError(error);
    }
  }

  async function saveAddress(userId, a) {
    await saveByUserId(
      'Addresses',
      'AddressID',
      userId,
      {
        Address_line: a.addressLine ?? null,
        Subdistrict: a.subdistrict ?? null,
        District: a.district ?? null,
        Province: a.province ?? null,
        Postal_code: a.postalCode ?? null,
      },
      { Created_at: new Date().toISOString() },
    );
  }

  async function saveStudent(userId, s) {
    await saveByUserId('Student', 'StudentID', userId, {
      Nickname: s.nickname,
      Birth_date: s.birthDate ?? null,
      School_name: s.schoolName ?? null,
      Grade_level: s.gradeLevel ?? null,
    });
  }

  async function saveTeacher(userId, t) {
    await saveByUserId('Teachers', 'TeacherID', userId, {
      Workplace_name: t.workplaceName ?? null,
      Bank_name: t.bankName ?? null,
      Bankaccount_name: t.bankAccountName ?? null,
      Bankaccount_number: t.bankAccountNumber ?? null,
      Promptpay_number: t.promptpayNumber ?? null,
    });
  }

    // ใบสมัครครูของ user หลายคนในครั้งเดียว
  async function findTeachersByUserIds(userIds) {
    if (userIds.length === 0) return [];

    const { data, error } = await supabase
      .from('Teachers')
      .select('UserID, Workplace_name, Bank_name, Bankaccount_name, Bankaccount_number, Promptpay_number')
      .in('UserID', userIds);

    if (error) throw dbError(error);

    return data.map((row) => ({
      userId: row.UserID,
      workplaceName: row.Workplace_name,
      bankName: row.Bank_name,
      bankAccountName: row.Bankaccount_name,
      bankAccountNumber: row.Bankaccount_number,
      promptpayNumber: row.Promptpay_number,
    }));
  }

  async function deleteTeacher(userId) {
    const { error } = await supabase.from('Teachers').delete().eq('UserID', userId);
    if (error) throw dbError(error);
  }

  async function findStudentsByUserIds(userIds) {
    if (userIds.length === 0) return [];

    const { data, error } = await supabase
      .from('Student')
      .select('UserID, Nickname, Grade_level, School_name')
      .in('UserID', userIds);

    if (error) throw dbError(error);

    return data.map((row) => ({
      userId: row.UserID,
      nickname: row.Nickname,
      gradeLevel: row.Grade_level,
      schoolName: row.School_name,
    }));
  }
  return {
    saveAddress, saveStudent, saveTeacher,
    findTeachersByUserIds, deleteTeacher, findStudentsByUserIds,
  };
}