import { Request, Response, NextFunction } from 'express';
import { Role } from '../generated/prisma/enums.js';
import { ForbiddenError, UnauthorizedError } from '../utils/error.js';

export function authorize(...allowedRoles: Role[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new UnauthorizedError('Access denied. Authentication required.')
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          'You do not have permission to perform this action.'
        )
      );
    }

    next();
  };
}