import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import * as routeService from '../services/route.service';
import * as aircraftService from '../services/aircraft.service';
import * as flightService from '../services/flight.service';
import * as statsService from '../services/stats.service';
import { User } from '../models/user.model';

const router = Router();

// All airline routes require auth + airline role
router.use(requireAuth);
router.use(requireRole(['airline']));

// Helper to get airlineId from user
async function getAirlineId(req: AuthRequest): Promise<string> {
  const user = await User.findById(req.userId);
  if (!user || !user.airlineId) {
    throw new Error('Airline not found');
  }
  return user.airlineId.toString();
}

// ============ ROUTES ============

// GET /api/airlines/routes
router.get('/routes', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const routes = await routeService.listRoutes(airlineId);
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// POST /api/airlines/routes
router.post('/routes', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const { originAirport, destinationAirport, flightNumber } = req.body;

    if (!originAirport || !destinationAirport || !flightNumber) {
      res.status(400).json({ error: 'Origin, destination, and flight number are required' });
      return;
    }

    const route = await routeService.createRoute({
      airlineId,
      originAirport,
      destinationAirport,
      flightNumber,
    });
    res.status(201).json(route);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create route';
    res.status(400).json({ error: message });
  }
});

// PUT /api/airlines/routes/:id
router.put('/routes/:id', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const { isActive, flightNumber } = req.body;
    const route = await routeService.updateRoute(req.params.id, airlineId, { isActive, flightNumber });
    if (!route) {
      res.status(404).json({ error: 'Route not found' });
      return;
    }
    res.json(route);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update route' });
  }
});

// DELETE /api/airlines/routes/:id
router.delete('/routes/:id', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    await routeService.deleteRoute(req.params.id, airlineId);
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete route';
    res.status(400).json({ error: message });
  }
});

// ============ AIRCRAFT ============

// GET /api/airlines/aircraft
router.get('/aircraft', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const aircraft = await aircraftService.listAircraft(airlineId);
    res.json(aircraft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch aircraft' });
  }
});

// POST /api/airlines/aircraft
router.post('/aircraft', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const { aircraftModel, registration, seatConfiguration } = req.body;

    if (!aircraftModel || !registration || !seatConfiguration) {
      res.status(400).json({ error: 'Aircraft model, registration, and seat configuration are required' });
      return;
    }

    const aircraft = await aircraftService.createAircraft({
      airlineId,
      aircraftModel,
      registration,
      seatConfiguration,
    });
    res.status(201).json(aircraft);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create aircraft';
    res.status(400).json({ error: message });
  }
});

// PUT /api/airlines/aircraft/:id
router.put('/aircraft/:id', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const { aircraftModel, seatConfiguration } = req.body;
    const aircraft = await aircraftService.updateAircraft(req.params.id, airlineId, { aircraftModel, seatConfiguration });
    if (!aircraft) {
      res.status(404).json({ error: 'Aircraft not found' });
      return;
    }
    res.json(aircraft);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update aircraft' });
  }
});

// DELETE /api/airlines/aircraft/:id
router.delete('/aircraft/:id', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    await aircraftService.deleteAircraft(req.params.id, airlineId);
    res.json({ message: 'Aircraft deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete aircraft';
    res.status(400).json({ error: message });
  }
});

// ============ FLIGHTS ============

// GET /api/airlines/flights
router.get('/flights', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const flights = await flightService.listFlights(airlineId);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// POST /api/airlines/flights
router.post('/flights', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const { routeId, aircraftId, departureTime, arrivalTime } = req.body;

    if (!routeId || !aircraftId || !departureTime || !arrivalTime) {
      res.status(400).json({ error: 'Route, aircraft, departure time, and arrival time are required' });
      return;
    }

    const flight = await flightService.createFlight({
      airlineId,
      routeId,
      aircraftId,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
    });
    res.status(201).json(flight);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create flight';
    res.status(400).json({ error: message });
  }
});

// PUT /api/airlines/flights/:id
router.put('/flights/:id', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const { departureTime, arrivalTime, status } = req.body;
    const updates: Record<string, unknown> = {};
    if (departureTime) updates.departureTime = new Date(departureTime);
    if (arrivalTime) updates.arrivalTime = new Date(arrivalTime);
    if (status) updates.status = status;

    const flight = await flightService.updateFlight(req.params.id, airlineId, updates);
    if (!flight) {
      res.status(404).json({ error: 'Flight not found' });
      return;
    }
    res.json(flight);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update flight' });
  }
});

// PUT /api/airlines/flights/:id/pricing
router.put('/flights/:id/pricing', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const { economy, business } = req.body;

    if (economy === undefined || business === undefined) {
      res.status(400).json({ error: 'Economy and business prices are required' });
      return;
    }

    const flight = await flightService.updatePricing(req.params.id, airlineId, { economy, business });
    if (!flight) {
      res.status(404).json({ error: 'Flight not found' });
      return;
    }
    res.json(flight);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update pricing' });
  }
});

// DELETE /api/airlines/flights/:id
router.delete('/flights/:id', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const flight = await flightService.cancelFlight(req.params.id, airlineId);
    if (!flight) {
      res.status(404).json({ error: 'Flight not found' });
      return;
    }
    res.json({ message: 'Flight cancelled successfully', flight });
  } catch (error) {
    res.status(400).json({ error: 'Failed to cancel flight' });
  }
});

// ============ STATISTICS ============

// GET /api/airlines/stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const airlineId = await getAirlineId(req);
    const stats = await statsService.getAirlineStats(airlineId);
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
