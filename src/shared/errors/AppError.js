export class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const Unauthorized = (message = 'Unauthorized', code = 'UNAUTHORIZED') =>
  new AppError(401, code, message);

export const Forbidden = (message = 'Forbidden', code = 'FORBIDDEN') =>
  new AppError(403, code, message);