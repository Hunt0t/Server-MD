import httpStatus from 'http-status';
import AppError from '../errors/AppError';

const unauthorized = (message: string, path?: string) => {
  return new AppError(401, message, [{ path: path || 'unauthorized', message }]);
};
const notFound = (message: string, path?: string) => {
  return new AppError(404, message, [{ path: path || 'not_found', message }]);
};
const conflict = (message: string, path?: string) => {
  return new AppError(409, message, [{ path: path || 'conflict', message }]);
};
const serverError = (message: string, path?: string) => {
  return new AppError(httpStatus.INTERNAL_SERVER_ERROR, message, [
    { path: path || 'serverError', message },
  ]);
};
const forbidden = (message: string, path?: string) => {
  return new AppError(403, message, [{ path: path || 'forbidden', message }]);
};

export { unauthorized, notFound, forbidden, serverError, conflict };
