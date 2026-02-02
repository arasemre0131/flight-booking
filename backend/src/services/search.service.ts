import mongoose from 'mongoose';
import { Flight, IFlight } from '../models/flight.model';
import { Route, IRoute } from '../models/route.model';
import { Aircraft, IAircraft } from '../models/aircraft.model';
import { Airline, IAirline } from '../models/airline.model';
import { getBookedSeats, generateSeatMap } from './seat.service';

// Airport code to city mapping
const AIRPORT_CITIES: Record<string, string> = {
  // US Airports
  JFK: 'New York',
  LAX: 'Los Angeles',
  ORD: 'Chicago',
  MIA: 'Miami',
  SFO: 'San Francisco',
  ATL: 'Atlanta',
  DFW: 'Dallas',
  DEN: 'Denver',
  SEA: 'Seattle',
  BOS: 'Boston',
  LAS: 'Las Vegas',
  PHX: 'Phoenix',
  IAH: 'Houston',
  MCO: 'Orlando',
  EWR: 'Newark',
  MSP: 'Minneapolis',
  DTW: 'Detroit',
  PHL: 'Philadelphia',
  LGA: 'New York',
  FLL: 'Fort Lauderdale',
  BWI: 'Baltimore',
  DCA: 'Washington',
  SLC: 'Salt Lake City',
  SAN: 'San Diego',
  TPA: 'Tampa',
  PDX: 'Portland',
  HNL: 'Honolulu',
  AUS: 'Austin',
  MSY: 'New Orleans',
  RDU: 'Raleigh',
  // European Airports
  IST: 'Istanbul',
  SAW: 'Istanbul',
  LHR: 'London',
  CDG: 'Paris',
  FRA: 'Frankfurt',
  AMS: 'Amsterdam',
  FCO: 'Rome',
  MAD: 'Madrid',
  BCN: 'Barcelona',
  MUC: 'Munich',
  ZRH: 'Zurich',
  VIE: 'Vienna',
  // Asian Airports
  NRT: 'Tokyo',
  HND: 'Tokyo',
  PEK: 'Beijing',
  PVG: 'Shanghai',
  HKG: 'Hong Kong',
  SIN: 'Singapore',
  ICN: 'Seoul',
  BKK: 'Bangkok',
  DXB: 'Dubai',
};

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
  class: 'economy' | 'business';
  sortBy: 'price' | 'duration' | 'stops';
  sortOrder: 'asc' | 'desc';
}

export interface FlightResult {
  flightId: string;
  flightNumber: string;
  airline: { id: string; name: string; code: string };
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  departureTime: Date;
  arrivalTime: Date;
  duration: number;
  price: number;
  aircraft: { model: string; seatConfig: string };
  availableSeats: { economy: number; business: number };
}

export interface SearchResult {
  type: 'direct' | 'connecting';
  pricePerPerson: number;
  totalDuration: number;
  stops: number;
  layover?: { airport: string; city: string; duration: number };
  flights: FlightResult[];
}

export interface SearchResponse {
  results: SearchResult[];
  searchParams: SearchParams;
}

function getCity(airportCode: string): string {
  return AIRPORT_CITIES[airportCode] || airportCode;
}

function calculateDuration(departure: Date, arrival: Date): number {
  return Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60));
}

function getSeatConfig(aircraft: IAircraft): string {
  const eco = aircraft.seatConfiguration.economy;
  const biz = aircraft.seatConfiguration.business;
  return `${biz.seatsPerRow}-${eco.seatsPerRow}`;
}

async function getAvailableSeatCount(
  flightId: string,
  aircraft: IAircraft
): Promise<{ economy: number; business: number }> {
  const eco = aircraft.seatConfiguration.economy;
  const biz = aircraft.seatConfiguration.business;

  const totalEconomy = eco.rows * eco.seatsPerRow;
  const totalBusiness = biz.rows * biz.seatsPerRow;

  // Get booked seats from Ticket collection
  const bookedSeats = await getBookedSeats(flightId);
  const seatMap = generateSeatMap(aircraft);

  let bookedEconomy = 0;
  let bookedBusiness = 0;

  for (const seatNumber of bookedSeats) {
    const seat = seatMap.find((s) => s.seatNumber === seatNumber);
    if (seat) {
      if (seat.class === 'economy') bookedEconomy++;
      else bookedBusiness++;
    }
  }

  return {
    economy: totalEconomy - bookedEconomy,
    business: totalBusiness - bookedBusiness,
  };
}

async function buildFlightResult(
  flight: IFlight,
  route: IRoute,
  aircraft: IAircraft,
  airline: IAirline,
  ticketClass: 'economy' | 'business'
): Promise<FlightResult> {
  const availableSeats = await getAvailableSeatCount(flight._id.toString(), aircraft);

  return {
    flightId: flight._id.toString(),
    flightNumber: route.flightNumber,
    airline: {
      id: airline._id.toString(),
      name: airline.name,
      code: airline.code,
    },
    origin: {
      code: route.originAirport,
      city: getCity(route.originAirport),
    },
    destination: {
      code: route.destinationAirport,
      city: getCity(route.destinationAirport),
    },
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    duration: calculateDuration(flight.departureTime, flight.arrivalTime),
    price: flight.pricing[ticketClass],
    aircraft: {
      model: aircraft.aircraftModel,
      seatConfig: getSeatConfig(aircraft),
    },
    availableSeats,
  };
}

export async function findDirectFlights(
  origin: string,
  destination: string,
  date: string,
  passengers: number,
  ticketClass: 'economy' | 'business'
): Promise<SearchResult[]> {
  const searchDate = new Date(date);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  // Find flights directly by origin/destination OR by routeId
  const flights = await Flight.find({
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    status: 'scheduled',
    departureTime: {
      $gte: searchDate,
      $lt: nextDay,
    },
  });

  // Also find routes matching origin and destination for legacy support
  const routes = await Route.find({
    originAirport: origin.toUpperCase(),
    destinationAirport: destination.toUpperCase(),
    isActive: true,
  });

  const routeIds = routes.map((r) => r._id);

  // Find flights by routeId (legacy)
  const routeFlights = await Flight.find({
    routeId: { $in: routeIds },
    status: 'scheduled',
    departureTime: {
      $gte: searchDate,
      $lt: nextDay,
    },
  });

  // Combine both (avoid duplicates)
  const allFlightIds = new Set<string>();
  const allFlights = [...flights, ...routeFlights].filter(f => {
    const id = f._id.toString();
    if (allFlightIds.has(id)) return false;
    allFlightIds.add(id);
    return true;
  });

  const results: SearchResult[] = [];

  for (const flight of allFlights) {
    // Skip flights without origin/destination
    if (!flight.origin || !flight.destination) continue;

    const aircraft = await Aircraft.findById(flight.aircraftId);
    if (!aircraft) continue;

    const airline = await Airline.findById(flight.airlineId);
    if (!airline) continue;

    const availableSeats = await getAvailableSeatCount(flight._id.toString(), aircraft);
    if (availableSeats[ticketClass] < passengers) continue;

    // Get price - support both basePrice and pricing object
    const price = flight.pricing?.[ticketClass] || flight.basePrice || 0;

    // Build flight result directly (no route dependency)
    const flightResult: FlightResult = {
      flightId: flight._id.toString(),
      flightNumber: `${airline.code}${flight._id.toString().slice(-4).toUpperCase()}`,
      airline: {
        id: airline._id.toString(),
        name: airline.name,
        code: airline.code,
      },
      origin: {
        code: flight.origin,
        city: getCity(flight.origin),
      },
      destination: {
        code: flight.destination,
        city: getCity(flight.destination),
      },
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      duration: calculateDuration(flight.departureTime, flight.arrivalTime),
      price,
      aircraft: {
        model: aircraft.aircraftModel || 'Unknown',
        seatConfig: getSeatConfig(aircraft),
      },
      availableSeats,
    };

    results.push({
      type: 'direct',
      pricePerPerson: price,
      totalDuration: flightResult.duration,
      stops: 0,
      flights: [flightResult],
    });
  }

  return results;
}

export async function findConnectingFlights(
  origin: string,
  destination: string,
  date: string,
  passengers: number,
  ticketClass: 'economy' | 'business'
): Promise<SearchResult[]> {
  const searchDate = new Date(date);
  const dayAfter = new Date(date);
  dayAfter.setDate(dayAfter.getDate() + 2);

  // Find all routes departing from origin
  const firstLegRoutes = await Route.find({
    originAirport: origin.toUpperCase(),
    isActive: true,
  });

  if (firstLegRoutes.length === 0) return [];

  // Find all routes arriving at destination
  const secondLegRoutes = await Route.find({
    destinationAirport: destination.toUpperCase(),
    isActive: true,
  });

  if (secondLegRoutes.length === 0) return [];

  // Find potential connection points
  const connectionPoints = new Set<string>();
  for (const firstRoute of firstLegRoutes) {
    for (const secondRoute of secondLegRoutes) {
      if (firstRoute.destinationAirport === secondRoute.originAirport) {
        connectionPoints.add(firstRoute.destinationAirport);
      }
    }
  }

  if (connectionPoints.size === 0) return [];

  const results: SearchResult[] = [];

  // For each connection point, find valid flight pairs
  for (const connectionAirport of connectionPoints) {
    // First leg routes to connection point
    const firstRoutes = firstLegRoutes.filter(
      (r) => r.destinationAirport === connectionAirport
    );
    // Second leg routes from connection point
    const secondRoutes = secondLegRoutes.filter(
      (r) => r.originAirport === connectionAirport
    );

    const firstRouteIds = firstRoutes.map((r) => r._id);
    const secondRouteIds = secondRoutes.map((r) => r._id);

    // Find first leg flights
    const firstFlights = await Flight.find({
      routeId: { $in: firstRouteIds },
      status: 'scheduled',
      departureTime: {
        $gte: searchDate,
        $lt: dayAfter,
      },
    });

    // Find second leg flights
    const secondFlights = await Flight.find({
      routeId: { $in: secondRouteIds },
      status: 'scheduled',
      departureTime: {
        $gte: searchDate,
        $lt: dayAfter,
      },
    });

    // Match flight pairs with valid layover (2-8 hours)
    for (const firstFlight of firstFlights) {
      for (const secondFlight of secondFlights) {
        const layoverMs =
          secondFlight.departureTime.getTime() - firstFlight.arrivalTime.getTime();
        const layoverMinutes = layoverMs / (1000 * 60);

        // Layover must be between 2 and 8 hours (120-480 minutes)
        if (layoverMinutes < 120 || layoverMinutes > 480) continue;

        if (!firstFlight.routeId || !secondFlight.routeId) continue;

        const firstRoute = firstRoutes.find(
          (r) => r._id.toString() === firstFlight.routeId!.toString()
        );
        const secondRoute = secondRoutes.find(
          (r) => r._id.toString() === secondFlight.routeId!.toString()
        );

        if (!firstRoute || !secondRoute) continue;

        const firstAircraft = await Aircraft.findById(firstFlight.aircraftId);
        const secondAircraft = await Aircraft.findById(secondFlight.aircraftId);

        if (!firstAircraft || !secondAircraft) continue;

        const firstAirline = await Airline.findById(firstFlight.airlineId);
        const secondAirline = await Airline.findById(secondFlight.airlineId);

        if (!firstAirline || !secondAirline) continue;

        // Check seat availability on both flights
        const firstSeats = await getAvailableSeatCount(firstFlight._id.toString(), firstAircraft);
        const secondSeats = await getAvailableSeatCount(secondFlight._id.toString(), secondAircraft);

        if (
          firstSeats[ticketClass] < passengers ||
          secondSeats[ticketClass] < passengers
        ) {
          continue;
        }

        const firstFlightResult = await buildFlightResult(
          firstFlight,
          firstRoute,
          firstAircraft,
          firstAirline,
          ticketClass
        );
        const secondFlightResult = await buildFlightResult(
          secondFlight,
          secondRoute,
          secondAircraft,
          secondAirline,
          ticketClass
        );

        const totalPrice =
          firstFlight.pricing[ticketClass] + secondFlight.pricing[ticketClass];
        const totalDuration =
          calculateDuration(firstFlight.departureTime, secondFlight.arrivalTime);

        results.push({
          type: 'connecting',
          pricePerPerson: totalPrice,
          totalDuration,
          stops: 1,
          layover: {
            airport: connectionAirport,
            city: getCity(connectionAirport),
            duration: Math.round(layoverMinutes),
          },
          flights: [firstFlightResult, secondFlightResult],
        });
      }
    }
  }

  return results;
}

export function sortResults(
  results: SearchResult[],
  sortBy: 'price' | 'duration' | 'stops',
  sortOrder: 'asc' | 'desc'
): SearchResult[] {
  const sorted = [...results].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'price':
        comparison = a.pricePerPerson - b.pricePerPerson;
        break;
      case 'duration':
        comparison = a.totalDuration - b.totalDuration;
        break;
      case 'stops':
        comparison = a.stops - b.stops;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  return sorted;
}

export async function searchFlights(params: SearchParams): Promise<SearchResponse> {
  const { origin, destination, date, passengers, class: ticketClass, sortBy, sortOrder } = params;

  // Find direct flights
  const directFlights = await findDirectFlights(
    origin,
    destination,
    date,
    passengers,
    ticketClass
  );

  // Find connecting flights
  const connectingFlights = await findConnectingFlights(
    origin,
    destination,
    date,
    passengers,
    ticketClass
  );

  // Combine and sort results
  const allResults = [...directFlights, ...connectingFlights];
  const sortedResults = sortResults(allResults, sortBy, sortOrder);

  return {
    results: sortedResults,
    searchParams: params,
  };
}
