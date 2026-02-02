import { Aircraft, IAircraft, ISeatConfiguration } from '../models/aircraft.model';
import { Flight } from '../models/flight.model';
import mongoose from 'mongoose';

export interface CreateAircraftInput {
  airlineId: string;
  aircraftModel: string;
  registration: string;
  seatConfiguration: ISeatConfiguration;
}

export async function createAircraft(input: CreateAircraftInput): Promise<IAircraft> {
  const economy = input.seatConfiguration.economy.rows * input.seatConfiguration.economy.seatsPerRow;
  const business = input.seatConfiguration.business.rows * input.seatConfiguration.business.seatsPerRow;

  const aircraft = await Aircraft.create({
    airlineId: new mongoose.Types.ObjectId(input.airlineId),
    aircraftModel: input.aircraftModel,
    registration: input.registration.toUpperCase(),
    seatConfiguration: input.seatConfiguration,
    totalSeats: economy + business,
  });
  return aircraft;
}

export async function listAircraft(airlineId: string): Promise<IAircraft[]> {
  return Aircraft.find({ airlineId: new mongoose.Types.ObjectId(airlineId) }).sort({ createdAt: -1 });
}

export async function getAircraft(aircraftId: string, airlineId: string): Promise<IAircraft | null> {
  return Aircraft.findOne({
    _id: new mongoose.Types.ObjectId(aircraftId),
    airlineId: new mongoose.Types.ObjectId(airlineId),
  });
}

export async function updateAircraft(
  aircraftId: string,
  airlineId: string,
  updates: Partial<{ aircraftModel: string; seatConfiguration: ISeatConfiguration }>
): Promise<IAircraft | null> {
  const updateData: Record<string, unknown> = { ...updates };

  // Recalculate total seats if seat config changed
  if (updates.seatConfiguration) {
    const economy = updates.seatConfiguration.economy.rows * updates.seatConfiguration.economy.seatsPerRow;
    const business = updates.seatConfiguration.business.rows * updates.seatConfiguration.business.seatsPerRow;
    updateData.totalSeats = economy + business;
  }

  return Aircraft.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(aircraftId), airlineId: new mongoose.Types.ObjectId(airlineId) },
    { $set: updateData },
    { new: true }
  );
}

export async function deleteAircraft(aircraftId: string, airlineId: string): Promise<void> {
  // Check if aircraft has active flights
  const activeFlights = await Flight.countDocuments({
    aircraftId: new mongoose.Types.ObjectId(aircraftId),
    status: { $in: ['scheduled', 'departed'] },
  });

  if (activeFlights > 0) {
    throw new Error('Cannot delete aircraft with active flights');
  }

  const result = await Aircraft.deleteOne({
    _id: new mongoose.Types.ObjectId(aircraftId),
    airlineId: new mongoose.Types.ObjectId(airlineId),
  });

  if (result.deletedCount === 0) {
    throw new Error('Aircraft not found');
  }
}
