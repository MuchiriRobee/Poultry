import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validators';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  }
}