const authService = require('./auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, full_name, role } = req.body;
      const result = await authService.registerUser(email, password, full_name, role);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();