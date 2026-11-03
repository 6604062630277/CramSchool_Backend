import { AppError } from '../errors/AppError.js';

function toDetails(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request body', toDetails(result.error));
    }
    req.body = result.data;
    next();
  };
}

export function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid URL parameter', toDetails(result.error));
    }
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid query string', toDetails(result.error));
    }
    req.validatedQuery = result.data;
    next();
  };
}