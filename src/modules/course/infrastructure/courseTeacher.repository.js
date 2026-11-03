import { dbError } from '../../../shared/infrastructure/dbError.js';

const TABLE = 'Courses_Teacher';

export function createCourseTeacherRepository(supabase) {
  async function listTeacherIds(courseId) {
    const { data, error } = await supabase.from(TABLE).select('TeacherID').eq('CourseID', courseId);
    if (error) throw dbError(error);
    return data.map((row) => row.TeacherID);
  }

  async function exists(courseId, teacherId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('CoursesTeacherID')
      .eq('CourseID', courseId)
      .eq('TeacherID', teacherId)
      .limit(1);
    if (error) throw dbError(error);
    return data.length > 0;
  }

  async function add(courseId, teacherId) {
    const { error } = await supabase.from(TABLE).insert({ CourseID: courseId, TeacherID: teacherId });
    if (error) throw dbError(error);
  }

  async function remove(courseId, teacherId) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('CourseID', courseId)
      .eq('TeacherID', teacherId);
    if (error) throw dbError(error);
  }

  return { listTeacherIds, exists, add, remove };
}