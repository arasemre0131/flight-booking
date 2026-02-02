// Admin Panel Models - 012-admin-panel

import { UserRole } from './auth.model';

// Re-export for convenience
export type { UserRole } from './auth.model';

// Status types
export type UserStatus = 'active' | 'inactive';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type AirlineStatus = 'active' | 'suspended';
export type DateRangePreset = 'today' | 'week' | 'month' | 'year' | 'custom';

// Airline summary for admin view
export interface AirlineSummary {
  id: string;
  name: string;
  code: string;
  operatorCount: number;
  activeOperators: number;
  routeCount: number;
  aircraftCount: number;
  flightCount: number;
  totalFlights: number;
  totalBookings: number;
  totalRevenue: number;
  status: AirlineStatus;
}

// Booking summary for admin view
export interface BookingSummary {
  id: string;
  confirmationCode: string;
  passengerName: string;
  passengerEmail: string;
  flightNumber: string;
  airlineId: string;
  airlineName: string;
  departureDate: string;
  route: string;
  amount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  seatAssignments?: string[];
}

// Platform statistics
export interface PlatformStats {
  totalUsers: number;
  totalAirlines: number;
  activeAirlines: number;
  totalBookings: number;
  totalRevenue: number;
  usersByRole: UsersByRole;
  bookingsByStatus: BookingsByStatus;
  userGrowth: GrowthDataPoint[];
  bookingVolume: BookingDataPoint[];
  revenueOverTime: RevenueDataPoint[];
  topAirlines: AirlineRanking[];
}

export interface UsersByRole {
  passenger: number;
  airline: number;
  admin: number;
}

export interface BookingsByStatus {
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface GrowthDataPoint {
  date: string;
  passengers: number;
  airlines: number;
  admins: number;
}

export interface BookingDataPoint {
  date: string;
  count: number;
  revenue: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface AirlineRanking {
  airlineId: string;
  name: string;
  bookingCount: number;
  revenue: number;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filters
export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
}

export interface BookingFilters {
  search?: string;
  airlineId?: string | 'all';
  status?: BookingStatus | 'all';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

// User management
export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'airline' | 'admin';
  tempPassword: string;
  airlineId?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Navigation
export interface AdminNavItem {
  path: string;
  label: string;
  icon: string;
}
