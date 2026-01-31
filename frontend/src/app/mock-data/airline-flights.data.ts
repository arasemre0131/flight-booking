// Mock Airline Flights Data - 011-airline-dashboard

import { AirlineFlight, FlightStatus } from '../models/airline-stats.model';

export const MOCK_AIRLINE_FLIGHTS: AirlineFlight[] = [
  {
    id: 'flight-001',
    airlineId: 'airline-001',
    routeId: 'route-001', // VCE → LHR
    aircraftId: 'aircraft-001', // A320
    flightNumber: 'AZ101',
    departureTime: '2025-02-01T08:00:00Z',
    arrivalTime: '2025-02-01T10:30:00Z',
    durationMinutes: 150,
    status: 'scheduled' as FlightStatus,
    pricing: {
      economy: 15000, // €150
      business: 45000, // €450
      firstClass: null
    },
    seatFees: {
      aisle: 500,
      window: 500,
      extraLegroom: 1500
    },
    bookedSeats: 45,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'flight-002',
    airlineId: 'airline-001',
    routeId: 'route-002', // VCE → FCO
    aircraftId: 'aircraft-002', // B737-800
    flightNumber: 'AZ201',
    departureTime: '2025-02-01T14:00:00Z',
    arrivalTime: '2025-02-01T15:15:00Z',
    durationMinutes: 75,
    status: 'scheduled' as FlightStatus,
    pricing: {
      economy: 8000, // €80
      business: 25000, // €250
      firstClass: null
    },
    seatFees: {
      aisle: 300,
      window: 300,
      extraLegroom: 1000
    },
    bookedSeats: 82,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z'
  },
  {
    id: 'flight-003',
    airlineId: 'airline-001',
    routeId: 'route-003', // VCE → CDG
    aircraftId: 'aircraft-001',
    flightNumber: 'AZ301',
    departureTime: '2025-02-02T06:30:00Z',
    arrivalTime: '2025-02-02T08:30:00Z',
    durationMinutes: 120,
    status: 'scheduled' as FlightStatus,
    pricing: {
      economy: 12000, // €120
      business: 38000, // €380
      firstClass: null
    },
    seatFees: {
      aisle: 500,
      window: 500,
      extraLegroom: 1200
    },
    bookedSeats: 110,
    createdAt: '2025-01-16T09:00:00Z',
    updatedAt: '2025-01-16T09:00:00Z'
  },
  {
    id: 'flight-004',
    airlineId: 'airline-001',
    routeId: 'route-004', // VCE → JFK
    aircraftId: 'aircraft-003', // A380
    flightNumber: 'AZ401',
    departureTime: '2025-02-03T10:00:00Z',
    arrivalTime: '2025-02-03T14:30:00Z',
    durationMinutes: 570,
    status: 'scheduled' as FlightStatus,
    pricing: {
      economy: 45000, // €450
      business: 150000, // €1500
      firstClass: 350000 // €3500
    },
    seatFees: {
      aisle: 1500,
      window: 1500,
      extraLegroom: 5000
    },
    bookedSeats: 250,
    createdAt: '2025-01-17T14:00:00Z',
    updatedAt: '2025-01-17T14:00:00Z'
  },
  {
    id: 'flight-005',
    airlineId: 'airline-001',
    routeId: 'route-001', // VCE → LHR
    aircraftId: 'aircraft-001',
    flightNumber: 'AZ102',
    departureTime: '2025-01-28T18:00:00Z',
    arrivalTime: '2025-01-28T20:30:00Z',
    durationMinutes: 150,
    status: 'arrived' as FlightStatus,
    pricing: {
      economy: 15000,
      business: 45000,
      firstClass: null
    },
    seatFees: {
      aisle: 500,
      window: 500,
      extraLegroom: 1500
    },
    bookedSeats: 168,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-28T20:30:00Z'
  },
  {
    id: 'flight-006',
    airlineId: 'airline-001',
    routeId: 'route-002', // VCE → FCO
    aircraftId: 'aircraft-002',
    flightNumber: 'AZ202',
    departureTime: '2025-01-29T09:00:00Z',
    arrivalTime: '2025-01-29T10:15:00Z',
    durationMinutes: 75,
    status: 'arrived' as FlightStatus,
    pricing: {
      economy: 7500,
      business: 22000,
      firstClass: null
    },
    seatFees: {
      aisle: 300,
      window: 300,
      extraLegroom: 1000
    },
    bookedSeats: 145,
    createdAt: '2025-01-12T11:00:00Z',
    updatedAt: '2025-01-29T10:15:00Z'
  },
  {
    id: 'flight-007',
    airlineId: 'airline-001',
    routeId: 'route-003', // VCE → CDG
    aircraftId: 'aircraft-001',
    flightNumber: 'AZ302',
    departureTime: '2025-01-25T07:00:00Z',
    arrivalTime: '2025-01-25T09:00:00Z',
    durationMinutes: 120,
    status: 'cancelled' as FlightStatus,
    pricing: {
      economy: 11000,
      business: 35000,
      firstClass: null
    },
    seatFees: {
      aisle: 500,
      window: 500,
      extraLegroom: 1200
    },
    bookedSeats: 0,
    createdAt: '2025-01-08T09:00:00Z',
    updatedAt: '2025-01-24T18:00:00Z'
  },
  {
    id: 'flight-008',
    airlineId: 'airline-001',
    routeId: 'route-001',
    aircraftId: 'aircraft-001',
    flightNumber: 'AZ103',
    departureTime: '2025-01-31T08:00:00Z',
    arrivalTime: '2025-01-31T10:30:00Z',
    durationMinutes: 150,
    status: 'boarding' as FlightStatus,
    pricing: {
      economy: 16000,
      business: 48000,
      firstClass: null
    },
    seatFees: {
      aisle: 500,
      window: 500,
      extraLegroom: 1500
    },
    bookedSeats: 175,
    createdAt: '2025-01-14T10:00:00Z',
    updatedAt: '2025-01-31T07:30:00Z'
  },
  {
    id: 'flight-009',
    airlineId: 'airline-001',
    routeId: 'route-005', // LHR → VCE
    aircraftId: 'aircraft-002',
    flightNumber: 'AZ501',
    departureTime: '2025-02-05T12:00:00Z',
    arrivalTime: '2025-02-05T14:30:00Z',
    durationMinutes: 150,
    status: 'scheduled' as FlightStatus,
    pricing: {
      economy: 14000,
      business: 42000,
      firstClass: null
    },
    seatFees: {
      aisle: 500,
      window: 500,
      extraLegroom: 1500
    },
    bookedSeats: 35,
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z'
  },
  {
    id: 'flight-010',
    airlineId: 'airline-001',
    routeId: 'route-004', // VCE → JFK
    aircraftId: 'aircraft-003',
    flightNumber: 'AZ402',
    departureTime: '2025-02-10T09:00:00Z',
    arrivalTime: '2025-02-10T13:30:00Z',
    durationMinutes: 570,
    status: 'scheduled' as FlightStatus,
    pricing: {
      economy: 48000,
      business: 160000,
      firstClass: 380000
    },
    seatFees: {
      aisle: 1500,
      window: 1500,
      extraLegroom: 5000
    },
    bookedSeats: 85,
    createdAt: '2025-01-22T14:00:00Z',
    updatedAt: '2025-01-22T14:00:00Z'
  }
];
