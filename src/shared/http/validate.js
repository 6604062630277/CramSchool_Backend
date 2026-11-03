import { AppError } from '../errors/AppError.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request body', details);
    }

    req.body = result.data;
    next();
  };
}