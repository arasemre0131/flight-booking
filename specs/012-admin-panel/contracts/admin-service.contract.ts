/**
 * Admin Service Contract
 * 012-admin-panel
 *
 * This file defines the contract for AdminService methods.
 * For MVP, these are implemented with mock data and localStorage.
 * Future backend integration should maintain this interface.
 */

import { Signal } from '@angular/core';

// ============================================================================
// Type Definitions (to be placed in models/admin.model.ts)
// ============================================================================

export type UserRole = 'passenger' | 'airline' | 'admin';
export type UserStatus = 'active' | 'inactive';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type AirlineStatus = 'active' | 'suspended';
export type DateRangePreset = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  airlineId?: string;
}

export interface AirlineSummary {
  id: string;
  name: string;
  code: string;
  operatorCount: number;
  routeCount: number;
  aircraftCount: number;
  flightCount: number;
  totalRevenue: number;
  status: AirlineStatus;
}

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
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  seatAssignments?: string[];
}

export interface PlatformStats {
  totalUsers: { passengers: number; airlines: number; admins: number; total: number };
  totalAirlines: number;
  totalBookings: number;
  totalRevenue: number;
  userGrowth: { date: string; passengers: number; airlines: number; admins: number }[];
  bookingVolume: { date: string; count: number; revenue: number }[];
  revenueOverTime: { date: string; revenue: number }[];
  topAirlines: { airlineId: string; name: string; bookingCount: number; revenue: number }[];
}

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

export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
}

export interface BookingFilters {
  search?: string;
  airlineId?: string | 'all';
  status?: BookingStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

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

// ============================================================================
// Service Contract
// ============================================================================

export interface AdminServiceContract {
  // Signals (readonly state)
  readonly users: Signal<User[]>;
  readonly airlines: Signal<AirlineSummary[]>;
  readonly bookings: Signal<BookingSummary[]>;
  readonly stats: Signal<PlatformStats | null>;
  readonly isLoading: Signal<boolean>;

  // User Management
  getUsers(filters: UserFilters, pagination: PaginationParams): Promise<PaginatedResult<User>>;
  getUserById(id: string): Promise<User | null>;
  createUser(data: CreateUserData): Promise<User>;
  updateUser(id: string, data: UpdateUserData): Promise<User>;
  changeUserRole(id: string, newRole: UserRole): Promise<User>;
  deactivateUser(id: string): Promise<void>;
  reactivateUser(id: string): Promise<void>;

  // Airline Management
  getAirlines(pagination: PaginationParams): Promise<PaginatedResult<AirlineSummary>>;
  getAirlineById(id: string): Promise<AirlineSummary | null>;
  getAirlineOperators(airlineId: string): Promise<User[]>;
  suspendAirline(id: string): Promise<void>;
  resumeAirline(id: string): Promise<void>;
  assignUserToAirline(userId: string, airlineId: string): Promise<void>;

  // Booking Overview
  getBookings(filters: BookingFilters, pagination: PaginationParams): Promise<PaginatedResult<BookingSummary>>;
  getBookingById(id: string): Promise<BookingSummary | null>;

  // Platform Statistics
  getStats(dateRange: DateRange): Promise<PlatformStats>;
  exportStatsCsv(dateRange: DateRange): Promise<Blob>;

  // Utility
  refreshData(): Promise<void>;
}
