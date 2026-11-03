export function createAdminController({ teacherApprovalService, userAdminService }){
  return {
    async listPendingTeachers(req, res) {
      const items = await teacherApprovalService.listPending();
      res.json({ data: items });
    },

    async approveTeacher(req, res) {
      const user = await teacherApprovalService.approve(req.params.userId);
      res.json({ data: user });
    },

    async rejectTeacher(req, res) {
      const user = await teacherApprovalService.reject(req.params.userId);
      res.json({ data: user });
    },
    
    async listUsers(req, res) {
      const result = await userAdminService.listUsers(req.validatedQuery);
      res.json({ data: result });
    },
  };
}