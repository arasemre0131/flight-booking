// Mock Aircraft Data - 011-airline-dashboard

import { Aircraft, createSeatClassConfig } from '../models/aircraft.model';

export const MOCK_AIRCRAFT: Aircraft[] = [
  {
    id: 'aircraft-001',
    airlineId: 'airline-001',
    model: 'Airbus A320',
    registration: 'I-ABCD',
    economyConfig: createSeatClassConfig(25, 6),   // 150 seats
    businessConfig: createSeatClassConfig(5, 4),   // 20 seats
    firstClassConfig: null,
    totalSeats: 170,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'aircraft-002',
    airlineId: 'airline-001',
    model: 'Boeing 737-800',
    registration: 'I-EFGH',
    economyConfig: createSeatClassConfig(28, 6),   // 168 seats
    businessConfig: createSeatClassConfig(3, 4),   // 12 seats
    firstClassConfig: null,
    totalSeats: 180,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'aircraft-003',
    airlineId: 'airline-001',
    model: 'Airbus A380',
    registration: 'I-IJKL',
    economyConfig: createSeatClassConfig(40, 10),  // 400 seats
    businessConfig: createSeatClassConfig(10, 6),  // 60 seats
    firstClassConfig: createSeatClassConfig(3, 4), // 12 seats
    totalSeats: 472,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'aircraft-004',
    airlineId: 'airline-001',
    model: 'Embraer E195',
    registration: 'I-MNOP',
    economyConfig: createSeatClassConfig(20, 4),   // 80 seats
    businessConfig: null,
    firstClassConfig: null,
    totalSeats: 80,
    isActive: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z'
  }
];
