import mongoose from 'mongoose';
import { Flight } from '../models/flight.model';
import { Booking } from '../models/booking.model';
import { Ticket } from '../models/ticket.model';
import { Route } from '../models/route.model';
import { Aircraft } from '../models/aircraft.model';

export interface AirlineStats {
  totalFlights: number;
  scheduledFlights: number;
  completedFlights: number;
  cancelledFlights: number;
  totalPassengers: number;
  totalRevenue: number;
  occupancyRate: number;
  topRoutes: Array<{
    routeId: string;
    origin: string;
    destination: string;
    flightCount: number;
    passengerCount: number;
    revenue: number;
  }>;
  revenueByClass: {
    economy: number;
    business: number;
  };
  flightsByMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
}

export async function getAirlineStats(airlineId: string): Promise<AirlineStats> {
  const airlineObjectId = new mongoose.Types.ObjectId(airlineId);

  // Get all flights for this airline
  const flights = await Flight.find({ airlineId: airlineObjectId });

  // Count by status
  const scheduledFlights = flights.filter(f => f.status === 'scheduled').length;
  const completedFlights = flights.filter(f => f.status === 'arrived').length;
  const cancelledFlights = flights.filter(f => f.status === 'cancelled').length;

  // Get all bookings for this airline's flights
  const flightIds = flights.map(f => f._id);
  const bookings = await Booking.find({
    flightId: { $in: flightIds },
    status: 'confirmed'
  });

  // Calculate totals
  let totalPassengers = 0;
  let totalRevenue = 0;
  let economyRevenue = 0;
  let businessRevenue = 0;

  for (const booking of bookings) {
    totalPassengers += booking.passengers.length;
    totalRevenue += booking.totalPrice;

    if (booking.ticketClass === 'economy') {
      economyRevenue += booking.totalPrice;
    } else {
      businessRevenue += booking.totalPrice;
    }
  }

  // Calculate occupancy rate
  const aircraft = await Aircraft.find({ airlineId: airlineObjectId });
  const totalCapacity = aircraft.reduce((sum, a) => sum + a.totalSeats, 0) * completedFlights;
  const occupancyRate = totalCapacity > 0 ? (totalPassengers / totalCapacity) : 0;

  // Get top routes
  const routes = await Route.find({ airlineId: airlineObjectId });
  const routeStats: Map<string, { flightCount: number; passengerCount: number; revenue: number }> = new Map();

  for (const flight of flights) {
    if (!flight.routeId) continue;
    const routeId = flight.routeId.toString();
    const current = routeStats.get(routeId) || { flightCount: 0, passengerCount: 0, revenue: 0 };
    current.flightCount++;

    // Find bookings for this flight
    const flightBookings = bookings.filter(b => b.flightId.toString() === flight._id.toString());
    for (const booking of flightBookings) {
      current.passengerCount += booking.passengers.length;
      current.revenue += booking.totalPrice;
    }

    routeStats.set(routeId, current);
  }

  const topRoutes = Array.from(routeStats.entries())
    .map(([routeId, stats]) => {
      const route = routes.find(r => r._id.toString() === routeId);
      return {
        routeId,
        origin: route?.originAirport || 'Unknown',
        destination: route?.destinationAirport || 'Unknown',
        ...stats
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate flights by month
  const monthStats: Map<string, { count: number; revenue: number }> = new Map();
  for (const flight of flights) {
    const month = flight.departureTime.toISOString().substring(0, 7); // YYYY-MM
    const current = monthStats.get(month) || { count: 0, revenue: 0 };
    current.count++;

    const flightBookings = bookings.filter(b => b.flightId.toString() === flight._id.toString());
    for (const booking of flightBookings) {
      current.revenue += booking.totalPrice;
    }

    monthStats.set(month, current);
  }

  const flightsByMonth = Array.from(monthStats.entries())
    .map(([month, stats]) => ({ month, ...stats }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12); // Last 12 months

  return {
    totalFlights: flights.length,
    scheduledFlights,
    completedFlights,
    cancelledFlights,
    totalPassengers,
    totalRevenue,
    occupancyRate: Math.round(occupancyRate * 100) / 100,
    topRoutes,
    revenueByClass: {
      economy: economyRevenue,
      business: businessRevenue
    },
    flightsByMonth
  };
}
