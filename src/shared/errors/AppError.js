export class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const Unauthorized = (message = 'Unauthorized', code = 'UNAUTHORIZED') =>
  new AppError(401, code, message);

export const Forbidden = (message = 'Forbidden', code = 'FORBIDDEN') =>
  new AppError(403, code, message);

export const Conflict = (message = 'Conflict', code = 'CONFLICT') =>
  new AppError(409, code, message);