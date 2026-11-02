const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyToken, requireRole } = require('../../middleware/authMiddleware');

// ตัวอย่าง Endpoint สำหรับสมัครสมาชิก (อาจให้เฉพาะ Admin สร้างบัญชีให้คนอื่น)
router.post('/register', verifyToken, requireRole(['admin']), (req, res) => authController.register(req, res));

module.exports = router;