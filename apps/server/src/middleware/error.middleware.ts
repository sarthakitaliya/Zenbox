import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/errors';  

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error middleware triggered:', err.message);

  const error = handleError(err);
  console.log('Error occurred:', error);

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}; 