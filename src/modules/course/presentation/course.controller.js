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
  };
}