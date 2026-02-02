// Mock Airline Stats Data - 011-airline-dashboard

import { AirlineStats, DateRange } from '../models/airline-stats.model';

export const MOCK_AIRLINE_STATS: AirlineStats = {
  dateRange: {
    start: '2025-01-01',
    end: '2025-01-31'
  },
  summary: {
    totalFlights: 45,
    totalPassengers: 5200,
    totalRevenue: 52000000, // €520,000 in cents
    averageLoadFactor: 78
  },
  topRoutes: [
    {
      routeId: 'route-001',
      origin: 'VCE',
      destination: 'LHR',
      passengerCount: 1200,
      revenue: 12000000
    },
    {
      routeId: 'route-003',
      origin: 'FCO',
      destination: 'JFK',
      passengerCount: 980,
      revenue: 14700000
    },
    {
      routeId: 'route-002',
      origin: 'VCE',
      destination: 'CDG',
      passengerCount: 850,
      revenue: 6800000
    },
    {
      routeId: 'route-004',
      origin: 'MXP',
      destination: 'BCN',
      passengerCount: 720,
      revenue: 5040000
    },
    {
      routeId: 'route-006',
      origin: 'LHR',
      destination: 'VCE',
      passengerCount: 650,
      revenue: 6500000
    }
  ],
  revenueByDay: [
    { date: '2025-01-01', revenue: 1500000 },
    { date: '2025-01-02', revenue: 1800000 },
    { date: '2025-01-03', revenue: 1200000 },
    { date: '2025-01-04', revenue: 2100000 },
    { date: '2025-01-05', revenue: 1900000 },
    { date: '2025-01-06', revenue: 1600000 },
    { date: '2025-01-07', revenue: 2200000 },
    { date: '2025-01-08', revenue: 1700000 },
    { date: '2025-01-09', revenue: 1400000 },
    { date: '2025-01-10', revenue: 1850000 },
    { date: '2025-01-11', revenue: 2050000 },
    { date: '2025-01-12', revenue: 1950000 },
    { date: '2025-01-13', revenue: 1300000 },
    { date: '2025-01-14', revenue: 1750000 },
    { date: '2025-01-15', revenue: 2300000 }
  ],
  flightsByStatus: {
    scheduled: 12,
    completed: 30,
    cancelled: 3
  }
};

// Helper function to get stats by date range (mock implementation)
export function getStatsByDateRange(range: DateRange): AirlineStats {
  // In a real implementation, this would filter the data
  // For now, return mock data with updated date range
  return {
    ...MOCK_AIRLINE_STATS,
    dateRange: range
  };
}
