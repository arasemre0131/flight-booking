// Airline Service - 011-airline-dashboard (Backend Integration)

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces matching backend responses
export interface BackendRoute {
  _id: string;
  airlineId: string;
  originAirport: string;
  destinationAirport: string;
  flightNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendAircraft {
  _id: string;
  airlineId: string;
  aircraftModel: string;
  registration: string;
  seatConfiguration: {
    firstClass: { rows: number; seatsPerRow: number };
    business: { rows: number; seatsPerRow: number };
    economy: { rows: number; seatsPerRow: number };
  };
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendFlight {
  _id: string;
  airlineId: string;
  routeId: string | { _id: string; originAirport: string; destinationAirport: string; flightNumber: string };
  aircraftId: string | { _id: string; aircraftModel: string; registration: string };
  departureTime: string;
  arrivalTime: string;
  pricing: { economy: number; business: number; firstClass: number };
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Frontend-compatible interfaces (for existing components)
export interface AirlineRoute {
  id: string;
  airlineId: string;
  originAirport: string;
  destinationAirport: string;
  flightNumberPrefix: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Aircraft {
  id: string;
  airlineId: string;
  model: string;
  registration: string;
  economyConfig: { rows: number; seatsPerRow: number; totalSeats: number };
  businessConfig: { rows: number; seatsPerRow: number; totalSeats: number } | null;
  firstClassConfig: { rows: number; seatsPerRow: number; totalSeats: number } | null;
  totalSeats: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AirlineFlight {
  id: string;
  airlineId: string;
  routeId: string;
  aircraftId: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  pricing: { economy: number; business: number; firstClass: number | null };
  seatFees: { aisle: number; window: number; extraLegroom: number };
  bookedSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteDto {
  originAirport: string;
  destinationAirport: string;
  flightNumber: string;
}

export interface CreateAircraftDto {
  model: string;
  registration: string;
  economyConfig: { rows: number; seatsPerRow: number; totalSeats?: number };
  businessConfig?: { rows: number; seatsPerRow: number; totalSeats?: number } | null;
  firstClassConfig?: { rows: number; seatsPerRow: number; totalSeats?: number } | null;
}

export interface CreateFlightDto {
  routeId: string;
  aircraftId: string;
  departureTime: string;
  arrivalTime: string;
}

// Import the proper AirlineStats type from model
import {
  AirlineStats as ModelAirlineStats,
  DateRange,
  TopRoute,
  RevenueByDay,
  FlightsByStatus,
  AirlineStatsSummary
} from '../models/airline-stats.model';

@Injectable({
  providedIn: 'root'
})
export class AirlineService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/airlines`;

  // State signals
  private _routes = signal<AirlineRoute[]>([]);
  private _aircraft = signal<Aircraft[]>([]);
  private _flights = signal<AirlineFlight[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly routes = this._routes.asReadonly();
  readonly aircraft = this._aircraft.asReadonly();
  readonly flights = this._flights.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly activeRoutes = computed(() => this._routes().filter(r => r.isActive));
  readonly activeAircraft = computed(() => this._aircraft().filter(a => a.isActive));
  readonly scheduledFlights = computed(() => this._flights().filter(f => f.status === 'scheduled'));

  // ==================== DATA LOADING ====================

  async loadAllData(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await Promise.all([
        this.loadRoutes(),
        this.loadAircraft(),
        this.loadFlights()
      ]);
    } catch (error) {
      this._error.set('Failed to load airline data');
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadRoutes(): Promise<void> {
    try {
      const routes = await firstValueFrom(
        this.http.get<BackendRoute[]>(`${this.API_URL}/routes`)
      );
      this._routes.set(routes.map(r => this.convertRoute(r)));
    } catch (error) {
      console.error('Failed to load routes:', error);
      throw error;
    }
  }

  async loadAircraft(): Promise<void> {
    try {
      const aircraft = await firstValueFrom(
        this.http.get<BackendAircraft[]>(`${this.API_URL}/aircraft`)
      );
      this._aircraft.set(aircraft.map(a => this.convertAircraft(a)));
    } catch (error) {
      console.error('Failed to load aircraft:', error);
      throw error;
    }
  }

  async loadFlights(): Promise<void> {
    try {
      const flights = await firstValueFrom(
        this.http.get<BackendFlight[]>(`${this.API_URL}/flights`)
      );
      this._flights.set(flights.map(f => this.convertFlight(f)));
    } catch (error) {
      console.error('Failed to load flights:', error);
      throw error;
    }
  }

  // ==================== ROUTE CRUD ====================

  async createRoute(dto: CreateRouteDto): Promise<AirlineRoute> {
    const response = await firstValueFrom(
      this.http.post<BackendRoute>(`${this.API_URL}/routes`, {
        originAirport: dto.originAirport.toUpperCase(),
        destinationAirport: dto.destinationAirport.toUpperCase(),
        flightNumber: dto.flightNumber.toUpperCase()
      })
    );
    const route = this.convertRoute(response);
    this._routes.update(routes => [...routes, route]);
    return route;
  }

  async updateRoute(id: string, updates: { isActive?: boolean; flightNumber?: string }): Promise<AirlineRoute> {
    const response = await firstValueFrom(
      this.http.put<BackendRoute>(`${this.API_URL}/routes/${id}`, updates)
    );
    const route = this.convertRoute(response);
    this._routes.update(routes => routes.map(r => r.id === id ? route : r));
    return route;
  }

  async deleteRoute(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.API_URL}/routes/${id}`)
    );
    this._routes.update(routes => routes.filter(r => r.id !== id));
  }

  async toggleRouteStatus(id: string): Promise<void> {
    const route = this._routes().find(r => r.id === id);
    if (route) {
      await this.updateRoute(id, { isActive: !route.isActive });
    }
  }

  getRouteById(id: string): AirlineRoute | undefined {
    return this._routes().find(r => r.id === id);
  }

  // ==================== AIRCRAFT CRUD ====================

  async createAircraft(dto: CreateAircraftDto): Promise<Aircraft> {
    // Convert frontend format to backend format
    const backendDto = {
      aircraftModel: dto.model,
      registration: dto.registration,
      seatConfiguration: {
        firstClass: dto.firstClassConfig
          ? { rows: dto.firstClassConfig.rows, seatsPerRow: dto.firstClassConfig.seatsPerRow }
          : { rows: 0, seatsPerRow: 0 },
        business: dto.businessConfig
          ? { rows: dto.businessConfig.rows, seatsPerRow: dto.businessConfig.seatsPerRow }
          : { rows: 0, seatsPerRow: 0 },
        economy: { rows: dto.economyConfig.rows, seatsPerRow: dto.economyConfig.seatsPerRow }
      }
    };

    const response = await firstValueFrom(
      this.http.post<BackendAircraft>(`${this.API_URL}/aircraft`, backendDto)
    );
    const aircraft = this.convertAircraft(response);
    this._aircraft.update(list => [...list, aircraft]);
    return aircraft;
  }

  async updateAircraft(id: string, updates: Partial<CreateAircraftDto>): Promise<Aircraft> {
    // Convert frontend format to backend format if needed
    const backendUpdates: any = {};
    if (updates.model) backendUpdates.aircraftModel = updates.model;
    if (updates.registration) backendUpdates.registration = updates.registration;
    if (updates.economyConfig || updates.businessConfig || updates.firstClassConfig) {
      backendUpdates.seatConfiguration = {
        firstClass: updates.firstClassConfig
          ? { rows: updates.firstClassConfig.rows, seatsPerRow: updates.firstClassConfig.seatsPerRow }
          : { rows: 0, seatsPerRow: 0 },
        business: updates.businessConfig
          ? { rows: updates.businessConfig.rows, seatsPerRow: updates.businessConfig.seatsPerRow }
          : { rows: 0, seatsPerRow: 0 },
        economy: updates.economyConfig
          ? { rows: updates.economyConfig.rows, seatsPerRow: updates.economyConfig.seatsPerRow }
          : { rows: 0, seatsPerRow: 0 }
      };
    }

    const response = await firstValueFrom(
      this.http.put<BackendAircraft>(`${this.API_URL}/aircraft/${id}`, backendUpdates)
    );
    const aircraft = this.convertAircraft(response);
    this._aircraft.update(list => list.map(a => a.id === id ? aircraft : a));
    return aircraft;
  }

  async deleteAircraft(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.API_URL}/aircraft/${id}`)
    );
    this._aircraft.update(list => list.filter(a => a.id !== id));
  }

  async toggleAircraftStatus(id: string): Promise<void> {
    const aircraft = this._aircraft().find(a => a.id === id);
    if (aircraft) {
      // Toggle by updating (backend doesn't have isActive for aircraft, so just reload)
      await this.loadAircraft();
    }
  }

  getAircraftById(id: string): Aircraft | undefined {
    return this._aircraft().find(a => a.id === id);
  }

  hasScheduledFlights(aircraftId: string): boolean {
    return this._flights().some(f => f.aircraftId === aircraftId && f.status === 'scheduled');
  }

  // ==================== FLIGHT CRUD ====================

  async createFlight(dto: CreateFlightDto): Promise<AirlineFlight> {
    const response = await firstValueFrom(
      this.http.post<BackendFlight>(`${this.API_URL}/flights`, dto)
    );
    const flight = this.convertFlight(response);
    this._flights.update(flights => [...flights, flight]);
    return flight;
  }

  async updateFlight(id: string, updates: Partial<{ departureTime: string; arrivalTime: string; status: string }>): Promise<AirlineFlight> {
    const response = await firstValueFrom(
      this.http.put<BackendFlight>(`${this.API_URL}/flights/${id}`, updates)
    );
    const flight = this.convertFlight(response);
    this._flights.update(flights => flights.map(f => f.id === id ? flight : f));
    return flight;
  }

  async updateFlightPricing(id: string, pricing: { economy: number; business: number | null }): Promise<AirlineFlight> {
    const response = await firstValueFrom(
      this.http.put<BackendFlight>(`${this.API_URL}/flights/${id}/pricing`, {
        economy: pricing.economy,
        business: pricing.business ?? 0
      })
    );
    const flight = this.convertFlight(response);
    this._flights.update(flights => flights.map(f => f.id === id ? flight : f));
    return flight;
  }

  async bulkUpdatePricing(ids: string[], pricing: { economy: number; business: number | null }): Promise<void> {
    for (const id of ids) {
      await this.updateFlightPricing(id, pricing);
    }
  }

  async cancelFlight(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.API_URL}/flights/${id}`)
    );
    this._flights.update(flights => flights.map(f =>
      f.id === id ? { ...f, status: 'cancelled' as const } : f
    ));
  }

  async updateFlightStatus(id: string, status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled'): Promise<void> {
    await this.updateFlight(id, { status });
  }

  getFlightById(id: string): AirlineFlight | undefined {
    return this._flights().find(f => f.id === id);
  }

  getFlightsByAircraft(aircraftId: string): AirlineFlight[] {
    return this._flights().filter(f => f.aircraftId === aircraftId);
  }

  getFlightsByRoute(routeId: string): AirlineFlight[] {
    return this._flights().filter(f => f.routeId === routeId);
  }

  checkAircraftConflict(
    aircraftId: string,
    departure: string,
    arrival: string,
    excludeFlightId?: string
  ): AirlineFlight | null {
    const departureTime = new Date(departure).getTime();
    const arrivalTime = new Date(arrival).getTime();

    return this._flights().find(f => {
      if (f.id === excludeFlightId) return false;
      if (f.aircraftId !== aircraftId) return false;
      if (f.status === 'cancelled') return false;

      const flightDeparture = new Date(f.departureTime).getTime();
      const flightArrival = new Date(f.arrivalTime).getTime();

      return !(arrivalTime <= flightDeparture || departureTime >= flightArrival);
    }) ?? null;
  }

  // ==================== STATISTICS ====================

  async getStatistics(dateRange?: DateRange): Promise<ModelAirlineStats> {
    // Calculate stats from loaded data
    const flights = this._flights();
    const scheduled = flights.filter(f => f.status === 'scheduled').length;
    const arrived = flights.filter(f => f.status === 'arrived').length;
    const cancelled = flights.filter(f => f.status === 'cancelled').length;

    const totalPassengers = flights.reduce((sum, f) => sum + f.bookedSeats, 0);
    const totalRevenue = flights.reduce((sum, f) => sum + (f.bookedSeats * f.pricing.economy), 0);

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      dateRange: dateRange || {
        start: weekAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      },
      summary: {
        totalFlights: flights.length,
        totalPassengers,
        totalRevenue,
        averageLoadFactor: 75
      },
      topRoutes: [],
      revenueByDay: [],
      flightsByStatus: {
        scheduled,
        completed: arrived,
        cancelled
      }
    };
  }

  // ==================== CONVERTERS ====================

  private convertRoute(r: BackendRoute): AirlineRoute {
    return {
      id: r._id,
      airlineId: r.airlineId,
      originAirport: r.originAirport,
      destinationAirport: r.destinationAirport,
      flightNumberPrefix: r.flightNumber,
      isActive: r.isActive,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    };
  }

  private convertAircraft(a: BackendAircraft): Aircraft {
    const firstClass = a.seatConfiguration.firstClass;
    const business = a.seatConfiguration.business;
    const economy = a.seatConfiguration.economy;

    return {
      id: a._id,
      airlineId: a.airlineId,
      model: a.aircraftModel,
      registration: a.registration,
      economyConfig: {
        rows: economy.rows,
        seatsPerRow: economy.seatsPerRow,
        totalSeats: economy.rows * economy.seatsPerRow
      },
      businessConfig: business && business.rows > 0 ? {
        rows: business.rows,
        seatsPerRow: business.seatsPerRow,
        totalSeats: business.rows * business.seatsPerRow
      } : null,
      firstClassConfig: firstClass && firstClass.rows > 0 ? {
        rows: firstClass.rows,
        seatsPerRow: firstClass.seatsPerRow,
        totalSeats: firstClass.rows * firstClass.seatsPerRow
      } : null,
      totalSeats: a.totalSeats,
      isActive: true,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    };
  }

  private convertFlight(f: BackendFlight): AirlineFlight {
    const routeId = typeof f.routeId === 'string' ? f.routeId : f.routeId._id;
    const aircraftId = typeof f.aircraftId === 'string' ? f.aircraftId : f.aircraftId._id;
    const flightNumber = typeof f.routeId === 'object' ? f.routeId.flightNumber : '';

    const departure = new Date(f.departureTime);
    const arrival = new Date(f.arrivalTime);
    const durationMinutes = Math.round((arrival.getTime() - departure.getTime()) / 60000);

    return {
      id: f._id,
      airlineId: f.airlineId,
      routeId,
      aircraftId,
      flightNumber,
      departureTime: f.departureTime,
      arrivalTime: f.arrivalTime,
      durationMinutes,
      status: f.status,
      pricing: {
        economy: f.pricing.economy,
        business: f.pricing.business,
        firstClass: f.pricing.firstClass || null
      },
      seatFees: { aisle: 0, window: 0, extraLegroom: 50 },
      bookedSeats: 0,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt
    };
  }
}
