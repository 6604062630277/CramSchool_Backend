import { dbError } from '../../../shared/infrastructure/dbError.js';

const TABLE = 'Users';
const COLUMNS =
  'UserID, Created_at, Profile_name, Role, Email, LineID, Phone_number, AvatarURL, Fullname';

// แปลงแถวจาก DB -> object ที่โค้ดส่วนอื่นใช้
function toUser(row) {
  if (!row) return null;
  return {
    id: row.UserID,
    email: row.Email,
    role: row.Role,
    profileName: row.Profile_name,
    fullName: row.Fullname,
    lineId: row.LineID,
    phoneNumber: row.Phone_number,
    avatarUrl: row.AvatarURL,
    createdAt: row.Created_at,
  };
}

export function createUserRepository(supabase) {
  async function findById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(COLUMNS)
      .eq('UserID', id)
      .maybeSingle();

    if (error) throw dbError(error);
    return toUser(data);
  }

  // สร้างโปรไฟล์ให้คนที่ login ครั้งแรก (ถ้ามีอยู่แล้วจะไม่ทำอะไร)
  async function createIfMissing({ id, email, fullName, avatarUrl }) {
    const { error } = await supabase
      .from(TABLE)
      .upsert(
        { UserID: id, Email: email, Fullname: fullName, AvatarURL: avatarUrl, Role: null },
        { onConflict: 'UserID', ignoreDuplicates: true },
      );

    if (error) throw dbError(error);
    return findById(id);
  }

    // มีแถวในตาราง Teachers ของ user นี้ไหม (= เคยสมัครเป็นครู)
  async function hasTeacherRecord(userId) {
    const { data, error } = await supabase
      .from('Teachers')
      .select('TeacherID')
      .eq('UserID', userId)
      .limit(1);

    if (error) throw dbError(error);
    return data.length > 0;
  }

  async function updateProfile(id, { profileName, fullName, phoneNumber, role }) {
    const { error } = await supabase
      .from(TABLE)
      .update({
        Profile_name: profileName,
        Fullname: fullName,
        Phone_number: phoneNumber,
        Role: role,
      })
      .eq('UserID', id);

    if (error) throw dbError(error);
  }
  return { findById, createIfMissing, hasTeacherRecord, updateProfile };
}


 