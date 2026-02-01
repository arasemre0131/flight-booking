import { Router, Request, Response } from 'express';
import { register, login, changePassword } from '../services/auth.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const result = await register({ email, password, firstName, lastName });
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ error: message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await login({ email, password });
    res.json(result);
  } catch (error) {
    // Generic error message for security
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req: Request, res: Response) => {
  // JWT is stateless, just return success
  // Client should remove token from storage
  res.json({ message: 'Logged out successfully' });
});

// PUT /api/auth/change-password
router.put('/change-password', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword) {
      res.status(400).json({ error: 'New password is required' });
      return;
    }

    await changePassword(req.userId!, currentPassword || '', newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Password change failed';
    res.status(400).json({ error: message });
  }
});

export default router;
