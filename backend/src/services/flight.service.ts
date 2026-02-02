import { Flight, IFlight, FlightStatus } from '../models/flight.model';
import { Route } from '../models/route.model';
import { Aircraft } from '../models/aircraft.model';
import mongoose from 'mongoose';

export interface CreateFlightInput {
  airlineId: string;
  routeId: string;
  aircraftId: string;
  departureTime: Date;
  arrivalTime: Date;
}

export interface UpdatePricingInput {
  economy: number;
  business: number;
}

export async function createFlight(input: CreateFlightInput): Promise<IFlight> {
  // Verify route belongs to airline
  const route = await Route.findOne({
    _id: new mongoose.Types.ObjectId(input.routeId),
    airlineId: new mongoose.Types.ObjectId(input.airlineId),
  });
  if (!route) {
    throw new Error('Route not found');
  }

  // Verify aircraft belongs to airline
  const aircraft = await Aircraft.findOne({
    _id: new mongoose.Types.ObjectId(input.aircraftId),
    airlineId: new mongoose.Types.ObjectId(input.airlineId),
  });
  if (!aircraft) {
    throw new Error('Aircraft not found');
  }

  const flight = await Flight.create({
    airlineId: new mongoose.Types.ObjectId(input.airlineId),
    routeId: new mongoose.Types.ObjectId(input.routeId),
    aircraftId: new mongoose.Types.ObjectId(input.aircraftId),
    origin: route.originAirport,
    destination: route.destinationAirport,
    departureTime: input.departureTime,
    arrivalTime: input.arrivalTime,
    status: 'scheduled',
    pricing: { economy: 0, business: 0 },
  });

  return flight;
}

export async function listFlights(airlineId: string): Promise<IFlight[]> {
  return Flight.find({ airlineId: new mongoose.Types.ObjectId(airlineId) })
    .populate('routeId')
    .populate('aircraftId')
    .sort({ departureTime: 1 });
}

export async function getFlight(flightId: string, airlineId: string): Promise<IFlight | null> {
  return Flight.findOne({
    _id: new mongoose.Types.ObjectId(flightId),
    airlineId: new mongoose.Types.ObjectId(airlineId),
  })
    .populate('routeId')
    .populate('aircraftId');
}

export async function updateFlight(
  flightId: string,
  airlineId: string,
  updates: Partial<{ departureTime: Date; arrivalTime: Date; status: FlightStatus }>
): Promise<IFlight | null> {
  return Flight.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(flightId), airlineId: new mongoose.Types.ObjectId(airlineId) },
    { $set: updates },
    { new: true }
  );
}

export async function updatePricing(
  flightId: string,
  airlineId: string,
  pricing: UpdatePricingInput
): Promise<IFlight | null> {
  return Flight.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(flightId), airlineId: new mongoose.Types.ObjectId(airlineId) },
    { $set: { pricing } },
    { new: true }
  );
}

export async function cancelFlight(flightId: string, airlineId: string): Promise<IFlight | null> {
  return Flight.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(flightId), airlineId: new mongoose.Types.ObjectId(airlineId) },
    { $set: { status: 'cancelled' } },
    { new: true }
  );
}
