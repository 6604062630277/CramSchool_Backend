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

// แปลงข้อมูลจากโค้ด -> ชื่อคอลัมน์ใน DB (ทิศตรงข้ามกับ toCourse)
function toRow(input) {
    const row = {
        Course_name: input.courseName,
        Description: input.description,
        Course_type: input.courseType,
        Totalhours: input.totalHours,
        Price: input.price,
        Max_students: input.maxStudents,
        Is_active: input.isActive,
    };
    // ตัดช่องที่ไม่ได้ส่งมาทิ้ง จะได้ไม่ไปทับค่าเดิมตอนแก้ไข
    return Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined));
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

    async function create(input) {
        const { data, error } = await supabase
        .from(TABLE)
        .insert(toRow(input))
        .select(COLUMNS)
        .single();

        if (error) throw dbError(error);
        return toCourse(data);
    }

    async function update(id, patch) {
        const { data, error } = await supabase
        .from(TABLE)
        .update(toRow(patch))
        .eq('CourseID', id)
        .select(COLUMNS)
        .maybeSingle();

        if (error) throw dbError(error);
        return toCourse(data);
    }

    return { list, findById, create, update };
}

