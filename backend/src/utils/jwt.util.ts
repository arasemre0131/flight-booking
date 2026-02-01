import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'skyroute-secret-key-change-in-production';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: IUser): string {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  // 24 hours in seconds
  return jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
