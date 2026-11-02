const authRepository = require('./auth.repository');

class AuthService {
  async handleGoogleLoginCallback(user) {
    // user ได้รับมาจาก Supabase Token หลังจาก Login ด้วย Gmail สำเร็จ
    const userId = user.id;
    const email = user.email;
    const profileName = user.user_metadata?.full_name || email.split('@')[0];

    // ตรวจสอบว่ามีข้อมูลในตาราง Users หรือยัง
    let existingUser = await authRepository.getUserById(userId);

    if (!existingUser) {
      // ถ้ายังไม่มี (ล็อกอินครั้งแรก) ให้บันทึกข้อมูลลงตาราง Users (กำหนด Role เริ่มต้นเป็น student หรือตามเงื่อนไข)
      existingUser = await authRepository.upsertUser(userId, email, profileName, 'student');
    }

    return {
      message: 'เข้าสู่ระบบสำเร็จ',
      user: existingUser
    };
  }
}

module.exports = new AuthService();