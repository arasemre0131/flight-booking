import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { searchFlights, SearchParams } from '../services/search.service';

const router = Router();

// Validation middleware
const searchValidation = [
  query('origin')
    .notEmpty()
    .withMessage('origin is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('origin must be 3 letter airport code')
    .isAlpha()
    .withMessage('origin must contain only letters')
    .toUpperCase(),
  query('destination')
    .notEmpty()
    .withMessage('destination is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('destination must be 3 letter airport code')
    .isAlpha()
    .withMessage('destination must contain only letters')
    .toUpperCase(),
  query('date')
    .notEmpty()
    .withMessage('date is required')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('date must be in YYYY-MM-DD format'),
  query('passengers')
    .optional()
    .isInt({ min: 1, max: 9 })
    .withMessage('passengers must be between 1 and 9')
    .toInt(),
  query('class')
    .optional()
    .isIn(['economy', 'business'])
    .withMessage('class must be economy or business'),
  query('sortBy')
    .optional()
    .isIn(['price', 'duration', 'stops'])
    .withMessage('sortBy must be price, duration, or stops'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

// GET /api/flights/search
router.get('/search', searchValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const params: SearchParams = {
      origin: (req.query.origin as string).toUpperCase(),
      destination: (req.query.destination as string).toUpperCase(),
      date: req.query.date as string,
      passengers: parseInt(req.query.passengers as string) || 1,
      class: (req.query.class as 'economy' | 'business') || 'economy',
      sortBy: (req.query.sortBy as 'price' | 'duration' | 'stops') || 'price',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
    };

    const results = await searchFlights(params);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

export default router;
