import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_ACCESS_SECRET || 'super_secret_access_key';

  try {
    const decoded = jwt.verify(token, secret) as any;
    
    // Attach user payload details cleanly into the Express request context
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // Pass control to the next guard down the line
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired access token.' });
  }
};