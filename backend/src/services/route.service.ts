import { Route, IRoute } from '../models/route.model';
import { Flight } from '../models/flight.model';
import mongoose from 'mongoose';

export interface CreateRouteInput {
  airlineId: string;
  originAirport: string;
  destinationAirport: string;
  flightNumber: string;
}

export async function createRoute(input: CreateRouteInput): Promise<IRoute> {
  const route = await Route.create({
    airlineId: new mongoose.Types.ObjectId(input.airlineId),
    originAirport: input.originAirport.toUpperCase(),
    destinationAirport: input.destinationAirport.toUpperCase(),
    flightNumber: input.flightNumber.toUpperCase(),
    isActive: true,
  });
  return route;
}

export async function listRoutes(airlineId: string): Promise<IRoute[]> {
  return Route.find({ airlineId: new mongoose.Types.ObjectId(airlineId) }).sort({ createdAt: -1 });
}

export async function getRoute(routeId: string, airlineId: string): Promise<IRoute | null> {
  return Route.findOne({
    _id: new mongoose.Types.ObjectId(routeId),
    airlineId: new mongoose.Types.ObjectId(airlineId),
  });
}

export async function updateRoute(
  routeId: string,
  airlineId: string,
  updates: Partial<{ isActive: boolean; flightNumber: string }>
): Promise<IRoute | null> {
  return Route.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(routeId), airlineId: new mongoose.Types.ObjectId(airlineId) },
    { $set: updates },
    { new: true }
  );
}

export async function deleteRoute(routeId: string, airlineId: string): Promise<void> {
  // Check if route has active flights
  const activeFlights = await Flight.countDocuments({
    routeId: new mongoose.Types.ObjectId(routeId),
    status: { $in: ['scheduled', 'departed'] },
  });

  if (activeFlights > 0) {
    throw new Error('Cannot delete route with active flights');
  }

  const result = await Route.deleteOne({
    _id: new mongoose.Types.ObjectId(routeId),
    airlineId: new mongoose.Types.ObjectId(airlineId),
  });

  if (result.deletedCount === 0) {
    throw new Error('Route not found');
  }
}
