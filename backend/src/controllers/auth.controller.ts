import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';


const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming request body using Zod schema
      const validatedData = registerSchema.parse(req.body);

      // Pass parsed payload to the business service layer
      const newUser = await authService.register(validatedData);

      // Send standard successful response format
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser,
      });
    } catch (error: any) {
      // Handle Zod validation formatting errors cleanly
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((e: any) => ({ field: e.path[0], message: e.message })),
        });
        return;
      }

      // Handle expected operational business logic errors (e.g., Email taken)
      res.status(400).json({
        success: false,
        message: error.message || 'An unexpected error occurred during registration',
      });
    }
  }
// 2. Inside the AuthController class, add this login method below your register method:
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request format
      const validatedData = loginSchema.parse(req.body);

      // Execute login business logic
      const result = await authService.login(validatedData);

      // Professional practice: Send refresh token in an HTTP-only cookie for web security, 
      // or pass it in the body for flexible client consumption
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((e: any) => ({ field: e.path[0], message: e.message })),
        });
        return;
      }

      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed',
      });
    }
  }
}