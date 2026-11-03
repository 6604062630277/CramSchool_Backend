export function createAuthController({ accountService }) {
  return {
    async me(req, res) {
      const me = await accountService.getMe(req.user.id);
      res.json({ data: me });
    },
    async register(req, res) {
      const me = await accountService.register(req.user.id, req.body);
      res.status(201).json({ data: me });
    },
  };
}