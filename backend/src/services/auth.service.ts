import { Connection, getConnection, getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendEmail } from '../utils/email';

export class AuthService {
  private async getRepository() {
    const connection: Connection = getConnection();
    return connection.getRepository(User);
  }

  async register(userData: Partial<User>) {
    const userRepository = await this.getRepository();
    
    const existingUser = await userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const verificationToken = jwt.sign(
      { email: userData.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const user = userRepository.create({
      ...userData,
      password: hashedPassword,
      verificationToken
    });

    await userRepository.save(user);

    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text: `Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
    });

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const userRepository = await this.getRepository();
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified
      }
    };
  }
}

export const authService = new AuthService();
