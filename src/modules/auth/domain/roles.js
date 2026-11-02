// ต้องตรงกับ enum "User_Role" ใน DB ทุกตัวอักษร
// ผู้ใช้ที่ Role = null คือยังไม่ได้รับอนุมัติจาก admin
export const ROLES = Object.freeze({
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
});