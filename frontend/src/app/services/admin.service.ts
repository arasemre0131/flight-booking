// Admin Service - 012-admin-panel

import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/auth.model';
import {
  AirlineSummary,
  BookingSummary,
  PlatformStats,
  PaginationParams,
  PaginatedResult,
  UserFilters,
  BookingFilters,
  DateRange,
  CreateUserData,
  UpdateUserData,
  UserRole
} from '../models/admin.model';
import {
  ADMIN_MOCK_USERS,
  ADMIN_MOCK_AIRLINES,
  ADMIN_MOCK_BOOKINGS,
  generatePlatformStats,
  AdminUser
} from '../mock-data/admin.data';

const USERS_KEY = 'tripma_admin_users';
const AIRLINES_KEY = 'tripma_admin_airlines';

@Injectable({ providedIn: 'root' })
export class AdminService {
  // Private state
  private _users = signal<AdminUser[]>([]);
  private _airlines = signal<AirlineSummary[]>([]);
  private _bookings = signal<BookingSummary[]>([]);
  private _stats = signal<PlatformStats | null>(null);
  private _isLoading = signal(false);

  // Public readonly signals
  readonly users = this._users.asReadonly();
  readonly airlines = this._airlines.asReadonly();
  readonly bookings = this._bookings.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Load or initialize users
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (storedUsers) {
      this._users.set(JSON.parse(storedUsers));
    } else {
      this._users.set(ADMIN_MOCK_USERS);
      this.saveUsers();
    }

    // Load or initialize airlines
    const storedAirlines = localStorage.getItem(AIRLINES_KEY);
    if (storedAirlines) {
      this._airlines.set(JSON.parse(storedAirlines));
    } else {
      this._airlines.set(ADMIN_MOCK_AIRLINES);
      this.saveAirlines();
    }

    // Bookings are always from mock (no persistence needed for read-only)
    this._bookings.set(ADMIN_MOCK_BOOKINGS);
  }

  private saveUsers(): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(this._users()));
  }

  private saveAirlines(): void {
    localStorage.setItem(AIRLINES_KEY, JSON.stringify(this._airlines()));
  }

  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // User Management
  // ============================================================================

  async getUsers(filters: UserFilters, pagination: PaginationParams): Promise<PaginatedResult<User>> {
    this._isLoading.set(true);
    await this.delay();

    let filtered = [...this._users()];

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(u =>
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    // Apply role filter
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(u => u.role === filters.role);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(u => u.status === filters.status);
    }

    // Apply sorting
    if (pagination.sortBy) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[pagination.sortBy!];
        const bVal = (b as any)[pagination.sortBy!];
        const order = pagination.sortOrder === 'desc' ? -1 : 1;
        return aVal < bVal ? -order : aVal > bVal ? order : 0;
      });
    }

    // Apply pagination
    const total = filtered.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const items = filtered.slice(start, start + pagination.pageSize);

    this._isLoading.set(false);

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize)
    };
  }

  async getUserById(id: string): Promise<User | null> {
    await this.delay(100);
    return this._users().find(u => u.id === id) || null;
  }

  async createUser(data: CreateUserData): Promise<User> {
    this._isLoading.set(true);
    await this.delay();

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.tempPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      status: 'active',
      airlineId: data.airlineId,
      createdAt: new Date().toISOString()
    };

    this._users.update(users => [...users, newUser]);
    this.saveUsers();
    this._isLoading.set(false);

    return newUser;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    this._isLoading.set(true);
    await this.delay();

    let updatedUser: AdminUser | null = null;

    this._users.update(users =>
      users.map(u => {
        if (u.id === id) {
          updatedUser = { ...u, ...data };
          return updatedUser;
        }
        return u;
      })
    );

    this.saveUsers();
    this._isLoading.set(false);

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async changeUserRole(id: string, newRole: UserRole): Promise<User> {
    this._isLoading.set(true);
    await this.delay();

    let updatedUser: AdminUser | null = null;

    this._users.update(users =>
      users.map(u => {
        if (u.id === id) {
          updatedUser = { ...u, role: newRole };
          // Clear airlineId if changing from airline role
          if (newRole !== 'airline') {
            updatedUser.airlineId = undefined;
          }
          return updatedUser;
        }
        return u;
      })
    );

    this.saveUsers();
    this._isLoading.set(false);

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async deactivateUser(id: string): Promise<void> {
    this._isLoading.set(true);
    await this.delay();

    this._users.update(users =>
      users.map(u => u.id === id ? { ...u, status: 'inactive' as const } : u)
    );

    // Clear user session from storage
    this.terminateUserSession(id);

    this.saveUsers();
    this._isLoading.set(false);
  }

  async reactivateUser(id: string): Promise<void> {
    this._isLoading.set(true);
    await this.delay();

    this._users.update(users =>
      users.map(u => u.id === id ? { ...u, status: 'active' as const } : u)
    );

    this.saveUsers();
    this._isLoading.set(false);
  }

  private terminateUserSession(userId: string): void {
    // Check localStorage session
    const localSession = localStorage.getItem('tripma_session');
    if (localSession) {
      const session = JSON.parse(localSession);
      if (session.userId === userId) {
        localStorage.removeItem('tripma_session');
      }
    }

    // Check sessionStorage session
    const sessionSession = sessionStorage.getItem('tripma_session');
    if (sessionSession) {
      const session = JSON.parse(sessionSession);
      if (session.userId === userId) {
        sessionStorage.removeItem('tripma_session');
      }
    }
  }

  // ============================================================================
  // Airline Management
  // ============================================================================

  async getAirlines(pagination: PaginationParams): Promise<PaginatedResult<AirlineSummary>> {
    this._isLoading.set(true);
    await this.delay();

    let airlines = [...this._airlines()];

    // Apply sorting
    if (pagination.sortBy) {
      airlines.sort((a, b) => {
        const aVal = (a as any)[pagination.sortBy!];
        const bVal = (b as any)[pagination.sortBy!];
        const order = pagination.sortOrder === 'desc' ? -1 : 1;
        return aVal < bVal ? -order : aVal > bVal ? order : 0;
      });
    }

    // Apply pagination
    const total = airlines.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const items = airlines.slice(start, start + pagination.pageSize);

    this._isLoading.set(false);

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize)
    };
  }

  async getAirlineById(id: string): Promise<AirlineSummary | null> {
    await this.delay(100);
    return this._airlines().find(a => a.id === id) || null;
  }

  async getAirlineOperators(airlineId: string): Promise<User[]> {
    await this.delay(100);
    return this._users().filter(u => u.airlineId === airlineId);
  }

  async suspendAirline(id: string): Promise<void> {
    this._isLoading.set(true);
    await this.delay();

    this._airlines.update(airlines =>
      airlines.map(a => a.id === id ? { ...a, status: 'suspended' as const } : a)
    );

    this.saveAirlines();
    this._isLoading.set(false);
  }

  async resumeAirline(id: string): Promise<void> {
    this._isLoading.set(true);
    await this.delay();

    this._airlines.update(airlines =>
      airlines.map(a => a.id === id ? { ...a, status: 'active' as const } : a)
    );

    this.saveAirlines();
    this._isLoading.set(false);
  }

  async assignUserToAirline(userId: string, airlineId: string): Promise<void> {
    this._isLoading.set(true);
    await this.delay();

    this._users.update(users =>
      users.map(u => {
        if (u.id === userId) {
          return { ...u, role: 'airline' as const, airlineId };
        }
        return u;
      })
    );

    // Update operator count
    this._airlines.update(airlines =>
      airlines.map(a => {
        if (a.id === airlineId) {
          return { ...a, operatorCount: a.operatorCount + 1 };
        }
        return a;
      })
    );

    this.saveUsers();
    this.saveAirlines();
    this._isLoading.set(false);
  }

  // ============================================================================
  // Booking Overview
  // ============================================================================

  async getBookings(filters: BookingFilters, pagination: PaginationParams): Promise<PaginatedResult<BookingSummary>> {
    this._isLoading.set(true);
    await this.delay();

    let filtered = [...this._bookings()];

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(b =>
        b.confirmationCode.toLowerCase().includes(search) ||
        b.passengerEmail.toLowerCase().includes(search)
      );
    }

    // Apply airline filter
    if (filters.airlineId && filters.airlineId !== 'all') {
      filtered = filtered.filter(b => b.airlineId === filters.airlineId);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      filtered = filtered.filter(b => new Date(b.departureDate) >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      filtered = filtered.filter(b => new Date(b.departureDate) <= to);
    }

    // Apply sorting
    if (pagination.sortBy) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[pagination.sortBy!];
        const bVal = (b as any)[pagination.sortBy!];
        const order = pagination.sortOrder === 'desc' ? -1 : 1;
        return aVal < bVal ? -order : aVal > bVal ? order : 0;
      });
    }

    // Apply pagination
    const total = filtered.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const items = filtered.slice(start, start + pagination.pageSize);

    this._isLoading.set(false);

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize)
    };
  }

  async getBookingById(id: string): Promise<BookingSummary | null> {
    await this.delay(100);
    return this._bookings().find(b => b.id === id) || null;
  }

  // ============================================================================
  // Platform Statistics
  // ============================================================================

  async getStats(dateRange: 'week' | 'month' | 'year' | 'all'): Promise<PlatformStats> {
    this._isLoading.set(true);
    await this.delay(500);

    const stats = generatePlatformStats(this._users(), this._airlines(), this._bookings());
    this._stats.set(stats);
    this._isLoading.set(false);

    return stats;
  }

  exportStatsCsv(dateRange: 'week' | 'month' | 'year' | 'all'): void {
    const stats = this._stats();
    if (!stats) return;

    // Build CSV content
    const lines: string[] = [];

    // Summary section
    lines.push('Platform Statistics Summary');
    lines.push(`Date Range,${dateRange}`);
    lines.push('');
    lines.push('Metric,Value');
    lines.push(`Total Users,${stats.totalUsers}`);
    lines.push(`Passengers,${stats.usersByRole.passenger}`);
    lines.push(`Airline Operators,${stats.usersByRole.airline}`);
    lines.push(`Admins,${stats.usersByRole.admin}`);
    lines.push(`Total Airlines,${stats.totalAirlines}`);
    lines.push(`Total Bookings,${stats.totalBookings}`);
    lines.push(`Total Revenue,${stats.totalRevenue.toFixed(2)}`);
    lines.push('');

    // Top airlines
    lines.push('Top Airlines by Revenue');
    lines.push('Airline,Bookings,Revenue');
    stats.topAirlines.forEach(a => {
      lines.push(`${a.name},${a.bookingCount},${a.revenue.toFixed(2)}`);
    });

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-stats-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================================================
  // Utility
  // ============================================================================

  async refreshData(): Promise<void> {
    this._isLoading.set(true);
    await this.delay(200);
    this.initializeData();
    this._isLoading.set(false);
  }

  // Get all airlines for dropdowns
  getAllAirlines(): AirlineSummary[] {
    return this._airlines();
  }
}
