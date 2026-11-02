export function createAuthController({ accountService }) {
  return {
    async me(req, res) {
      const me = await accountService.getMe(req.user.id);
      res.json({ data: me });
    },
  };
}