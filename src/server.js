import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/index.js';
import { notFoundHandler, errorHandler } from './shared/http/errorHandler.js';
import { courseRouter } from './modules/course/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ---- โมดูล ----
app.use('/api/v1', authRouter);
app.use('/api/v1', courseRouter);
// app.use('/api/v1', courseRouter);   ← โมดูลถัดไปจะมาต่อตรงนี้

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});