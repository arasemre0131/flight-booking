import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { inviteAirline, listUsers, deleteUser } from '../services/user.service';

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth);
router.use(requireRole(['admin']));

// POST /api/admin/invite-airline
router.post('/invite-airline', async (req: AuthRequest, res: Response) => {
  try {
    const { email, companyName, airlineCode } = req.body;

    if (!email || !companyName || !airlineCode) {
      res.status(400).json({ error: 'Email, company name, and airline code are required' });
      return;
    }

    if (airlineCode.length < 2 || airlineCode.length > 3) {
      res.status(400).json({ error: 'Airline code must be 2-3 characters' });
      return;
    }

    const result = await inviteAirline({ email, companyName, airlineCode });
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invitation failed';
    res.status(400).json({ error: message });
  }
});

// GET /api/admin/users
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Deletion failed';
    res.status(400).json({ error: message });
  }
});

export default router;
