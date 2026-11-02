import express from 'express';
import cors from 'cors';
import { authRouter, requireAuth, requireRole, ROLES } from './modules/auth/index.js';
import { notFoundHandler, errorHandler } from './shared/http/errorHandler.js';
import { env } from './config/env.js';
import { supabaseAdmin } from './shared/infrastructure/supabase.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cram School Backend is running smoothly!' });
});
// ← ใหม่: ทดสอบว่าต่อ Supabase ได้ และมีตาราง users จริง
app.get('/api/health/db', async (req, res) => {
  const { data, count, error, status } = await supabaseAdmin
    .from('Users')
    .select('UserID', { count: 'exact' })
    .limit(1);

  res.json({ status, count, error, data });
});

app.get('/api/v1/admin-only', requireAuth(), requireRole(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'สวัสดี admin' });
});

// ต้องอยู่ท้ายสุด ต่อจาก route ทั้งหมด
app.use('/api/v1', authRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


