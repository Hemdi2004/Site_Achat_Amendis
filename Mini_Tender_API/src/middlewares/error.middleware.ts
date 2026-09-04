import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: any,// this line defines a parameter named error of type any, which means it can accept any value. In the context of an error handling middleware, this parameter is used to capture the error object that is passed to the middleware when an error occurs during the processing of a request. The error object typically contains information about the error, such as its message, stack trace, and any custom properties that may have been added by the application or other middleware.
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || 'Internal server error',
  });
}