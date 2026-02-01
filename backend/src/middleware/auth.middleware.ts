import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.util';
import { User } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: TokenPayload;
  userId?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    // Check if user still exists and is active
    const user = await User.findById(payload.userId);
    if (!user || user.status !== 'active') {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if password change is required (except for change-password endpoint)
    if (user.mustChangePassword && !req.path.includes('change-password')) {
      res.status(403).json({ error: 'Password change required', code: 'PASSWORD_CHANGE_REQUIRED' });
      return;
    }

    req.user = payload;
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
