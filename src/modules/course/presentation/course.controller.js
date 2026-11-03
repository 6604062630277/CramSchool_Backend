export function createCourseController({ courseService }) {
  return {
    async list(req, res) {
      res.json({ data: await courseService.listOpen() });
    },

    async detail(req, res) {
      res.json({ data: await courseService.getOpen(req.params.courseId) });
    },

    async adminList(req, res) {
      res.json({ data: await courseService.listAll() });
    },

    async adminDetail(req, res) {
      res.json({ data: await courseService.getAny(req.params.courseId) });
    },

    async create(req, res) {
      const course = await courseService.create(req.body);
      res.status(201).json({ data: course });
    },

    async update(req, res) {
      const course = await courseService.update(req.params.courseId, req.body);
      res.json({ data: course });
    },

    async assignTeacher(req, res) {
      const course = await courseService.assignTeacher(req.params.courseId, req.body.teacherId);
      res.status(201).json({ data: course });
    },

    async removeTeacher(req, res) {
      const course = await courseService.removeTeacher(req.params.courseId, req.params.teacherId);
      res.json({ data: course });
    },
  };
}