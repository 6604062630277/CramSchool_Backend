import { dbError } from '../../../shared/infrastructure/dbError.js';

const TABLE = 'Courses';
const COLUMNS =
  'CourseID, Course_name, Description, Course_type, Totalhours, Price, Max_students, Is_active, Created_at';

function toCourse(row) {
  if (!row) return null;
  return {
    id: row.CourseID,
    courseName: row.Course_name,
    description: row.Description,
    courseType: row.Course_type,
    totalHours: row.Totalhours,
    price: row.Price === null ? null : Number(row.Price),
    maxStudents: row.Max_students,
    // คอร์สเก่าที่สร้างไว้ก่อนมีระบบนี้ไม่ได้ตั้งค่าไว้ (null) จึงถือว่าเปิดรับสมัคร
    isActive: row.Is_active !== false,
    createdAt: row.Created_at,
  };
}

export function createCourseRepository(supabase) {
  async function list({ includeInactive }) {
    let query = supabase
      .from(TABLE)
      .select(COLUMNS)
      .order('Created_at', { ascending: false });

    if (!includeInactive) {
      query = query.not('Is_active', 'is', false);
    }

    const { data, error } = await query;
    if (error) throw dbError(error);
    return data.map(toCourse);
  }

  async function findById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(COLUMNS)
      .eq('CourseID', id)
      .maybeSingle();

    if (error) throw dbError(error);
    return toCourse(data);
  }

  return { list, findById };
}