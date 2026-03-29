import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput, AuthResponse, UserResponse } from '../types/auth.types';

const userRepository = new UserRepository();

export class AuthService {
  async register(data: RegisterInput): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Create user
    const newUser = await userRepository.createUser({
      ...data,
      passwordHash,
    });

    return {
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    };
  }
}