const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

class AuthRepository {
  // ค้นหาข้อมูลผู้ใช้จาก Userid
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('Userid', userId)
      .single();
    if (error) return null;
    return data;
  }

  // สร้างหรืออัปเดตข้อมูลผู้ใช้เมื่อ Login ผ่าน Gmail ครั้งแรก (Upsert)
  async upsertUser(userId, email, profileName, role = 'student') {
    const { data, error } = await supabase
      .from('Users')
      .upsert([
        {
          Userid: userId,
          Email: email,
          Profile_name: profileName,
          Role: role,
        }
      ], { onConflict: 'Userid' })
      .select();

    if (error) throw error;
    return data;
  }

  // อัปเดต LineID (กรณีเชื่อมต่อ LINE OA)
  async updateLineId(userId, lineId) {
    const { data, error } = await supabase
      .from('Users')
      .update({ LineID: lineId })
      .eq('Userid', userId)
      .select();

    if (error) throw error;
    return data;
  }
}

module.exports = new AuthRepository();