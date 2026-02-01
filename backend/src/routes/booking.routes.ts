import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import {
  createBooking,
  selectSeats,
  confirmBooking,
  cancelBooking,
  getUserBookings,
  getBookingById,
  CreateBookingData,
  SeatAssignment,
  PaymentDetails,
} from '../services/booking.service';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/bookings - Create a new booking
router.post(
  '/',
  requireAuth,
  [
    body('flightId').isMongoId().withMessage('Valid flight ID required'),
    body('passengers').isArray({ min: 1, max: 9 }).withMessage('1-9 passengers required'),
    body('passengers.*.firstName').trim().notEmpty().withMessage('First name required'),
    body('passengers.*.lastName').trim().notEmpty().withMessage('Last name required'),
    body('passengers.*.email').isEmail().withMessage('Valid email required'),
    body('passengers.*.phone').trim().notEmpty().withMessage('Phone required'),
    body('passengers.*.dateOfBirth').isISO8601().withMessage('Valid date of birth required'),
    body('passengers.*.passportNumber').trim().notEmpty().withMessage('Passport number required'),
    body('ticketClass').isIn(['economy', 'business']).withMessage('Valid ticket class required'),
    body('extras.additionalBaggage').optional().isInt({ min: 0, max: 5 }),
    body('extras.extraLegroom').optional().isBoolean(),
  ],
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const data: CreateBookingData = {
        flightId: req.body.flightId,
        passengers: req.body.passengers.map((p: any) => ({
          ...p,
          dateOfBirth: new Date(p.dateOfBirth),
        })),
        ticketClass: req.body.ticketClass,
        extras: {
          additionalBaggage: req.body.extras?.additionalBaggage || 0,
          extraLegroom: req.body.extras?.extraLegroom || false,
        },
      };

      const booking = await createBooking(userId, data);
      res.status(201).json({
        message: 'Booking created successfully',
        booking: {
          id: booking._id,
          status: booking.status,
          totalPrice: booking.totalPrice,
          passengers: booking.passengers.length,
          expiresIn: '15 minutes',
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// GET /api/bookings - Get user's bookings
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const bookings = await getUserBookings(userId);
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/:id - Get booking details
router.get(
  '/:id',
  requireAuth,
  [param('id').isMongoId().withMessage('Valid booking ID required')],
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'admin';
      const { booking, tickets } = await getBookingById(req.params.id, userId, isAdmin);
      res.json({ booking, tickets });
    } catch (error: any) {
      if (error.message === 'Booking not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/bookings/:id/seats - Select seats for a booking
router.post(
  '/:id/seats',
  requireAuth,
  [
    param('id').isMongoId().withMessage('Valid booking ID required'),
    body('assignments').isArray({ min: 1 }).withMessage('Seat assignments required'),
    body('assignments.*.passengerIndex').isInt({ min: 0 }).withMessage('Valid passenger index required'),
    body('assignments.*.seatNumber').matches(/^[0-9]+[A-F]$/i).withMessage('Valid seat number required (e.g., 12A)'),
  ],
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const assignments: SeatAssignment[] = req.body.assignments;

      const booking = await selectSeats(req.params.id, userId, assignments);
      res.json({
        message: 'Seats selected successfully',
        booking: {
          id: booking._id,
          status: booking.status,
          totalPrice: booking.totalPrice,
        },
      });
    } catch (error: any) {
      if (error.message === 'Booking not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
);

// POST /api/bookings/:id/confirm - Confirm booking with payment
router.post(
  '/:id/confirm',
  requireAuth,
  [
    param('id').isMongoId().withMessage('Valid booking ID required'),
    body('paymentMethod').equals('card').withMessage('Only card payment supported'),
    body('cardDetails.number').isCreditCard().withMessage('Valid card number required'),
    body('cardDetails.expiry').matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/).withMessage('Valid expiry (MM/YY) required'),
    body('cardDetails.cvv').matches(/^[0-9]{3,4}$/).withMessage('Valid CVV required'),
    body('cardDetails.name').trim().notEmpty().withMessage('Cardholder name required'),
  ],
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const payment: PaymentDetails = {
        paymentMethod: 'card',
        cardDetails: req.body.cardDetails,
      };

      const { booking, tickets } = await confirmBooking(req.params.id, userId, payment);
      res.json({
        message: 'Booking confirmed successfully',
        booking: {
          id: booking._id,
          status: booking.status,
          totalPrice: booking.totalPrice,
        },
        tickets,
      });
    } catch (error: any) {
      if (error.message === 'Booking not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE /api/bookings/:id - Cancel a booking
router.delete(
  '/:id',
  requireAuth,
  [param('id').isMongoId().withMessage('Valid booking ID required')],
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const booking = await cancelBooking(req.params.id, userId);
      res.json({
        message: 'Booking cancelled successfully',
        booking: {
          id: booking._id,
          status: booking.status,
        },
      });
    } catch (error: any) {
      if (error.message === 'Booking not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
