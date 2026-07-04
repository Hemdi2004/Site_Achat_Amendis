import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import prisma from '../config/prisma';

export const authorizePermission = (requiredPermission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized. User context missing.' });
        return;
      }

      // Check if the user's assigned role is mapped to the required permission inside the junction table
      const hasPermission = await prisma.rolePermission.findFirst({
        where: {
          role: {
            name: user.role,
          },
          permission: {
            name: requiredPermission,
          },
        },
      });

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message: `Forbidden. You do not have permission to execute this action (${requiredPermission}).`,
        });
        return;
      }

      next(); // User has permission! Proceed cleanly to the controller execution layer
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server authorization check failure.' });
    }
  };
};