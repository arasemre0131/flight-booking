// Admin Panel Mock Data - 012-admin-panel

import { User } from '../models/auth.model';
import { AirlineSummary, BookingSummary, PlatformStats, UserStatus } from '../models/admin.model';

// Extended User type with status
export interface AdminUser extends User {
  status: UserStatus;
  airlineId?: string;
}

// Generate 35 mock users for pagination testing
export const ADMIN_MOCK_USERS: AdminUser[] = [
  // Existing users with status
  {
    id: 'user-001',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'passenger',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-002',
    email: 'john@example.com',
    password: 'john1234',
    firstName: 'John',
    lastName: 'Doe',
    role: 'passenger',
    status: 'active',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'user-003',
    email: 'airline@example.com',
    password: 'airline123',
    firstName: 'Airline',
    lastName: 'Operator',
    role: 'airline',
    status: 'active',
    airlineId: 'airline-hawaiian',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-004',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  // Additional passengers
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `user-pass-${i + 1}`,
    email: `passenger${i + 1}@example.com`,
    password: 'pass123',
    firstName: `Passenger`,
    lastName: `${i + 1}`,
    role: 'passenger' as const,
    status: (i % 5 === 0 ? 'inactive' : 'active') as UserStatus,
    createdAt: new Date(2025, 0, 1 + i).toISOString()
  })),
  // Additional airline operators
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `user-airline-${i + 1}`,
    email: `airline.op${i + 1}@example.com`,
    password: 'airline123',
    firstName: `Operator`,
    lastName: `${i + 1}`,
    role: 'airline' as const,
    status: 'active' as UserStatus,
    airlineId: ['airline-hawaiian', 'airline-japan', 'airline-delta'][i % 3],
    createdAt: new Date(2025, 0, 5 + i * 2).toISOString()
  })),
  // Additional admins
  {
    id: 'user-admin-2',
    email: 'superadmin@example.com',
    password: 'super123',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-02T00:00:00Z'
  }
];

// Mock airlines with summaries
export const ADMIN_MOCK_AIRLINES: AirlineSummary[] = [
  {
    id: 'airline-hawaiian',
    name: 'Hawaiian Airlines',
    code: 'HA',
    operatorCount: 3,
    activeOperators: 3,
    routeCount: 5,
    aircraftCount: 8,
    flightCount: 24,
    totalFlights: 24,
    totalBookings: 156,
    totalRevenue: 15000000,
    status: 'active'
  },
  {
    id: 'airline-japan',
    name: 'Japan Airlines',
    code: 'JL',
    operatorCount: 4,
    activeOperators: 4,
    routeCount: 8,
    aircraftCount: 12,
    flightCount: 36,
    totalFlights: 36,
    totalBookings: 245,
    totalRevenue: 28000000,
    status: 'active'
  },
  {
    id: 'airline-delta',
    name: 'Delta Air Lines',
    code: 'DL',
    operatorCount: 2,
    activeOperators: 2,
    routeCount: 12,
    aircraftCount: 20,
    flightCount: 48,
    totalFlights: 48,
    totalBookings: 320,
    totalRevenue: 42000000,
    status: 'active'
  },
  {
    id: 'airline-united',
    name: 'United Airlines',
    code: 'UA',
    operatorCount: 0,
    activeOperators: 0,
    routeCount: 10,
    aircraftCount: 15,
    flightCount: 40,
    totalFlights: 40,
    totalBookings: 280,
    totalRevenue: 35000000,
    status: 'suspended'
  },
  {
    id: 'airline-lufthansa',
    name: 'Lufthansa',
    code: 'LH',
    operatorCount: 1,
    activeOperators: 1,
    routeCount: 6,
    aircraftCount: 10,
    flightCount: 28,
    totalFlights: 28,
    totalBookings: 180,
    totalRevenue: 22000000,
    status: 'active'
  }
];

// Mock bookings
export const ADMIN_MOCK_BOOKINGS: BookingSummary[] = Array.from({ length: 60 }, (_, i) => {
  const airlines = ADMIN_MOCK_AIRLINES;
  const airline = airlines[i % airlines.length];
  const statuses: BookingSummary['status'][] = ['pending', 'confirmed', 'cancelled', 'completed'];
  const paymentStatuses: BookingSummary['paymentStatus'][] = ['pending', 'paid', 'refunded'];
  const amount = 15000 + (i * 500) + Math.floor(Math.random() * 10000);

  return {
    id: `booking-${String(i + 1).padStart(3, '0')}`,
    confirmationCode: `TRP${String(i + 1).padStart(6, '0')}`,
    passengerName: `Passenger ${i + 1}`,
    passengerEmail: `passenger${i + 1}@example.com`,
    flightNumber: `${airline.code}${100 + (i % 50)}`,
    airlineId: airline.id,
    airlineName: airline.name,
    departureDate: new Date(2025, 1, 1 + (i % 28)).toISOString(),
    route: ['JFK → LAX', 'SFO → ORD', 'MIA → SEA', 'BOS → DFW', 'ATL → DEN'][i % 5],
    amount,
    totalAmount: amount,
    status: statuses[i % 4],
    paymentStatus: paymentStatuses[i % 3],
    createdAt: new Date(2025, 0, 15 + (i % 15)).toISOString(),
    seatAssignments: i % 3 === 0 ? ['12A', '12B'] : ['8C']
  };
});

// Generate platform stats
export function generatePlatformStats(
  users: AdminUser[],
  airlines: AirlineSummary[],
  bookings: BookingSummary[]
): PlatformStats {
  // Count users by role
  const passengers = users.filter(u => u.role === 'passenger').length;
  const airlineUsers = users.filter(u => u.role === 'airline').length;
  const admins = users.filter(u => u.role === 'admin').length;

  // Count bookings by status
  const pending = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const completed = bookings.filter(b => b.status === 'completed').length;

  // Calculate totals
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);

  // Generate growth data (last 7 days)
  const now = new Date();
  const userGrowth = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      passengers: Math.max(0, passengers - (6 - i) * 2),
      airlines: airlineUsers,
      admins: admins
    };
  });

  // Booking volume by day
  const bookingVolume = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10) + 5,
      revenue: Math.floor(Math.random() * 50000) + 20000
    };
  });

  // Revenue over time
  const revenueOverTime = bookingVolume.map(b => ({
    date: b.date,
    revenue: b.revenue
  }));

  // Top airlines
  const topAirlines = airlines
    .map(a => ({
      airlineId: a.id,
      name: a.name,
      bookingCount: a.totalBookings,
      revenue: a.totalRevenue
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalUsers: users.length,
    totalAirlines: airlines.length,
    activeAirlines: airlines.filter(a => a.status === 'active').length,
    totalBookings: bookings.length,
    totalRevenue,
    usersByRole: {
      passenger: passengers,
      airline: airlineUsers,
      admin: admins
    },
    bookingsByStatus: {
      pending,
      confirmed,
      cancelled,
      completed
    },
    userGrowth,
    bookingVolume,
    revenueOverTime,
    topAirlines
  };
}
