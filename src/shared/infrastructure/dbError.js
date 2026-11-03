import { AppError } from '../errors/AppError.js';

export function dbError(error) {
  return new AppError(500, 'DB_ERROR', error.message);
}