import { AppError } from '../errors/AppError.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `${req.method} ${req.path} not found` },
  });
}

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }
  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  });
}