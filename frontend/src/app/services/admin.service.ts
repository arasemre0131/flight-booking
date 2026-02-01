// Admin Service - 012-admin-panel (Backend Integration)

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/auth.model';
import {
  AirlineSummary,
  BookingSummary,
  PlatformStats,
  PaginationParams,
  PaginatedResult,
  UserFilters,
  BookingFilters,
  CreateUserData,
  UpdateUserData,
  UserRole
} from '../models/admin.model';
import { environment } from '../../environments/environment';

// Backend response types
export interface BackendUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'passenger' | 'airline' | 'admin';
  status: 'active' | 'inactive';
  airlineId?: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InviteAirlineResponse {
  message: string;
  user: BackendUser;
  airline: {
    _id: string;
    name: string;
    code: string;
  };
  tempPassword: string;
}

// Extended user for admin panel
export interface AdminUser extends User {
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // Private state
  private _users = signal<AdminUser[]>([]);
  private _airlines = signal<AirlineSummary[]>([]);
  private _bookings = signal<BookingSummary[]>([]);
  private _stats = signal<PlatformStats | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly users = this._users.asReadonly();
  readonly airlines = this._airlines.asReadonly();
  readonly bookings = this._bookings.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // ============================================================================
  // Data Loading
  // ============================================================================

  async loadUsers(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const users = await firstValueFrom(
        this.http.get<BackendUser[]>(`${this.API_URL}/admin/users`)
      );
      this._users.set(users.map(u => this.convertUser(u)));
    } catch (error) {
      console.error('Failed to load users:', error);
      this._error.set('Failed to load users');
    } finally {
      this._isLoading.set(false);
    }
  }

  // ============================================================================
  // User Management
  // ============================================================================

  async getUsers(filters: UserFilters, pagination: PaginationParams): Promise<PaginatedResult<User>> {
    // Load fresh data from backend
    await this.loadUsers();

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

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize)
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return this._users().find(u => u.id === id) || null;
  }

  async deleteUser(id: string): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(
        this.http.delete(`${this.API_URL}/admin/users/${id}`)
      );
      this._users.update(users => users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      this._error.set('Failed to delete user');
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  async deactivateUser(id: string): Promise<void> {
    // Backend doesn't have deactivate, use delete
    await this.deleteUser(id);
  }

  async reactivateUser(id: string): Promise<void> {
    // Not implemented in backend
    console.warn('Reactivate user not implemented in backend');
  }

  // ============================================================================
  // Airline Invitation
  // ============================================================================

  async inviteAirline(data: {
    email: string;
    companyName: string;
    airlineCode: string;
    firstName?: string;
    lastName?: string;
  }): Promise<InviteAirlineResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(
        this.http.post<InviteAirlineResponse>(`${this.API_URL}/admin/invite-airline`, data)
      );

      // Add new user to local state
      const newUser = this.convertUser(response.user);
      this._users.update(users => [...users, newUser]);

      return response;
    } catch (error: any) {
      console.error('Failed to invite airline:', error);
      const message = error.error?.error || 'Failed to invite airline';
      this._error.set(message);
      throw new Error(message);
    } finally {
      this._isLoading.set(false);
    }
  }

  // Legacy method for compatibility
  async createUser(data: CreateUserData): Promise<User> {
    if (data.role === 'airline' && data.airlineId) {
      const response = await this.inviteAirline({
        email: data.email,
        companyName: data.airlineId,
        airlineCode: 'NEW',
        firstName: data.firstName,
        lastName: data.lastName
      });
      return this.convertUser(response.user);
    }
    throw new Error('Only airline users can be created via invitation');
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    // Backend doesn't support user updates currently
    console.warn('Update user not fully implemented in backend');
    const user = this._users().find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async changeUserRole(id: string, newRole: UserRole): Promise<User> {
    // Backend doesn't support role changes currently
    console.warn('Change user role not implemented in backend');
    const user = this._users().find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  // ============================================================================
  // Airline Management (Mock - backend doesn't have these endpoints yet)
  // ============================================================================

  async getAirlines(pagination: PaginationParams): Promise<PaginatedResult<AirlineSummary>> {
    // Extract airlines from users
    const airlineUsers = this._users().filter(u => u.role === 'airline');
    const airlineIds = new Set(airlineUsers.map(u => u.airlineId).filter(Boolean));

    const airlines: AirlineSummary[] = Array.from(airlineIds).map(id => {
      const operatorCount = airlineUsers.filter(u => u.airlineId === id).length;
      return {
        id: id!,
        name: `Airline ${id?.substring(0, 8)}`,
        code: 'XX',
        status: 'active' as const,
        operatorCount,
        activeOperators: operatorCount,
        routeCount: 0,
        aircraftCount: 0,
        flightCount: 0,
        totalFlights: 0,
        totalBookings: 0,
        totalRevenue: 0
      };
    });

    const total = airlines.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const items = airlines.slice(start, start + pagination.pageSize);

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize)
    };
  }

  async getAirlineById(id: string): Promise<AirlineSummary | null> {
    return this._airlines().find(a => a.id === id) || null;
  }

  async getAirlineOperators(airlineId: string): Promise<User[]> {
    return this._users().filter(u => u.airlineId === airlineId);
  }

  async suspendAirline(id: string): Promise<void> {
    console.warn('Suspend airline not implemented in backend');
  }

  async resumeAirline(id: string): Promise<void> {
    console.warn('Resume airline not implemented in backend');
  }

  async assignUserToAirline(userId: string, airlineId: string): Promise<void> {
    console.warn('Assign user to airline not implemented in backend');
  }

  // ============================================================================
  // Booking Overview (Mock - backend doesn't have admin booking endpoints)
  // ============================================================================

  async getBookings(filters: BookingFilters, pagination: PaginationParams): Promise<PaginatedResult<BookingSummary>> {
    // Return empty for now - would need backend endpoint
    return {
      items: [],
      total: 0,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: 0
    };
  }

  async getBookingById(id: string): Promise<BookingSummary | null> {
    return null;
  }

  // ============================================================================
  // Platform Statistics
  // ============================================================================

  async getStats(dateRange: 'week' | 'month' | 'year' | 'all'): Promise<PlatformStats> {
    await this.loadUsers();

    const users = this._users();
    const passengers = users.filter(u => u.role === 'passenger').length;
    const airlines = users.filter(u => u.role === 'airline').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const totalAirlines = new Set(users.filter(u => u.airlineId).map(u => u.airlineId)).size;

    const stats: PlatformStats = {
      totalUsers: users.length,
      usersByRole: {
        passenger: passengers,
        airline: airlines,
        admin: admins
      },
      totalAirlines,
      activeAirlines: totalAirlines,
      totalBookings: 0,
      totalRevenue: 0,
      bookingsByStatus: {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0
      },
      userGrowth: [],
      bookingVolume: [],
      revenueOverTime: [],
      topAirlines: []
    };

    this._stats.set(stats);
    return stats;
  }

  exportStatsCsv(dateRange: 'week' | 'month' | 'year' | 'all'): void {
    const stats = this._stats();
    if (!stats) return;

    const lines: string[] = [];
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

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });

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
    await this.loadUsers();
  }

  getAllAirlines(): AirlineSummary[] {
    return this._airlines();
  }

  // ============================================================================
  // Converters
  // ============================================================================

  private convertUser(u: BackendUser): AdminUser {
    return {
      id: u._id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      status: u.status,
      airlineId: u.airlineId,
      mustChangePassword: u.mustChangePassword,
      createdAt: u.createdAt
    };
  }
}
