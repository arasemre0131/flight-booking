import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { inviteAirline, listUsers, deleteUser } from '../services/user.service';
import { Airline } from '../models/airline.model';
import { Booking } from '../models/booking.model';
import { Flight } from '../models/flight.model';
import { User } from '../models/user.model';

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

// GET /api/admin/airlines
router.get('/airlines', async (req: AuthRequest, res: Response) => {
  try {
    const airlines = await Airline.find().sort({ name: 1 });

    // Get operator count and flight stats for each airline
    const airlinesWithStats = await Promise.all(
      airlines.map(async (airline) => {
        const operatorCount = await User.countDocuments({
          airlineId: airline._id,
          role: 'airline'
        });
        const flightCount = await Flight.countDocuments({
          airlineId: airline._id
        });

        return {
          _id: airline._id,
          name: airline.name,
          code: airline.code,
          status: airline.status,
          operatorCount,
          flightCount,
          createdAt: airline.createdAt,
          updatedAt: airline.updatedAt
        };
      })
    );

    res.json(airlinesWithStats);
  } catch (error) {
    console.error('Failed to fetch airlines:', error);
    res.status(500).json({ error: 'Failed to fetch airlines' });
  }
});

// GET /api/admin/bookings
router.get('/bookings', async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'firstName lastName email')
      .populate({
        path: 'flightId',
        populate: {
          path: 'airlineId',
          select: 'name code'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;
