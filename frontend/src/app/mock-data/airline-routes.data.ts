// Mock Airline Routes Data - 011-airline-dashboard

import { AirlineRoute } from '../models/airline-route.model';

export const MOCK_AIRLINE_ROUTES: AirlineRoute[] = [
  {
    id: 'route-001',
    airlineId: 'airline-001',
    originAirport: 'VCE',
    destinationAirport: 'LHR',
    flightNumberPrefix: 'AZ100',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'route-002',
    airlineId: 'airline-001',
    originAirport: 'VCE',
    destinationAirport: 'CDG',
    flightNumberPrefix: 'AZ200',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'route-003',
    airlineId: 'airline-001',
    originAirport: 'FCO',
    destinationAirport: 'JFK',
    flightNumberPrefix: 'AZ300',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'route-004',
    airlineId: 'airline-001',
    originAirport: 'MXP',
    destinationAirport: 'BCN',
    flightNumberPrefix: 'AZ400',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'route-005',
    airlineId: 'airline-001',
    originAirport: 'VCE',
    destinationAirport: 'FCO',
    flightNumberPrefix: 'AZ500',
    isActive: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'route-006',
    airlineId: 'airline-001',
    originAirport: 'LHR',
    destinationAirport: 'VCE',
    flightNumberPrefix: 'AZ101',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];
