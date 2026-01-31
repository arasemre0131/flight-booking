// Airline Service - 011-airline-dashboard

import { Injectable, signal, computed } from '@angular/core';
import { AirlineRoute, CreateRouteDto, UpdateRouteDto } from '../models/airline-route.model';
import { Aircraft, CreateAircraftDto, UpdateAircraftDto, calculateTotalSeats, createSeatClassConfig } from '../models/aircraft.model';
import { AirlineFlight, CreateFlightDto, UpdateFlightDto, AirlineStats, DateRange, FlightStatus, FlightPricing } from '../models/airline-stats.model';
import { MOCK_AIRLINE_ROUTES } from '../mock-data/airline-routes.data';
import { MOCK_AIRCRAFT } from '../mock-data/aircraft.data';
import { MOCK_AIRLINE_STATS, getStatsByDateRange } from '../mock-data/airline-stats.data';

@Injectable({
  providedIn: 'root'
})
export class AirlineService {
  // Current airline ID (would come from auth in real app)
  private readonly currentAirlineId = 'airline-001';

  // State signals
  private _routes = signal<AirlineRoute[]>([...MOCK_AIRLINE_ROUTES]);
  private _aircraft = signal<Aircraft[]>([...MOCK_AIRCRAFT]);
  private _flights = signal<AirlineFlight[]>([]);

  // Public readonly signals
  readonly routes = this._routes.asReadonly();
  readonly aircraft = this._aircraft.asReadonly();
  readonly flights = this._flights.asReadonly();

  // Computed signals
  readonly activeRoutes = computed(() => this._routes().filter(r => r.isActive));
  readonly activeAircraft = computed(() => this._aircraft().filter(a => a.isActive));
  readonly scheduledFlights = computed(() => this._flights().filter(f => f.status === 'scheduled'));

  constructor() {
    this.initializeFlights();
  }

  private initializeFlights(): void {
    // Create some mock flights
    const mockFlights: AirlineFlight[] = [
      {
        id: 'flight-001',
        airlineId: this.currentAirlineId,
        routeId: 'route-001',
        aircraftId: 'aircraft-001',
        flightNumber: 'AZ100',
        departureTime: '2025-02-15T08:00:00Z',
        arrivalTime: '2025-02-15T10:30:00Z',
        durationMinutes: 150,
        status: 'scheduled',
        pricing: { economy: 9900, business: 24900, firstClass: null },
        seatFees: { aisle: 500, window: 500, extraLegroom: 1500 },
        bookedSeats: 45,
        createdAt: '2025-01-20T00:00:00Z',
        updatedAt: '2025-01-20T00:00:00Z'
      },
      {
        id: 'flight-002',
        airlineId: this.currentAirlineId,
        routeId: 'route-002',
        aircraftId: 'aircraft-002',
        flightNumber: 'AZ200',
        departureTime: '2025-02-15T14:00:00Z',
        arrivalTime: '2025-02-15T16:00:00Z',
        durationMinutes: 120,
        status: 'scheduled',
        pricing: { economy: 7900, business: 19900, firstClass: null },
        seatFees: { aisle: 400, window: 400, extraLegroom: 1200 },
        bookedSeats: 82,
        createdAt: '2025-01-20T00:00:00Z',
        updatedAt: '2025-01-20T00:00:00Z'
      },
      {
        id: 'flight-003',
        airlineId: this.currentAirlineId,
        routeId: 'route-003',
        aircraftId: 'aircraft-003',
        flightNumber: 'AZ300',
        departureTime: '2025-02-16T09:00:00Z',
        arrivalTime: '2025-02-16T17:00:00Z',
        durationMinutes: 480,
        status: 'scheduled',
        pricing: { economy: 39900, business: 99900, firstClass: 199900 },
        seatFees: { aisle: 1000, window: 1000, extraLegroom: 3000 },
        bookedSeats: 210,
        createdAt: '2025-01-20T00:00:00Z',
        updatedAt: '2025-01-20T00:00:00Z'
      },
      {
        id: 'flight-004',
        airlineId: this.currentAirlineId,
        routeId: 'route-001',
        aircraftId: 'aircraft-001',
        flightNumber: 'AZ100',
        departureTime: '2025-01-20T08:00:00Z',
        arrivalTime: '2025-01-20T10:30:00Z',
        durationMinutes: 150,
        status: 'arrived',
        pricing: { economy: 9900, business: 24900, firstClass: null },
        seatFees: { aisle: 500, window: 500, extraLegroom: 1500 },
        bookedSeats: 142,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-20T10:30:00Z'
      },
      {
        id: 'flight-005',
        airlineId: this.currentAirlineId,
        routeId: 'route-004',
        aircraftId: 'aircraft-002',
        flightNumber: 'AZ400',
        departureTime: '2025-01-18T12:00:00Z',
        arrivalTime: '2025-01-18T14:00:00Z',
        durationMinutes: 120,
        status: 'cancelled',
        pricing: { economy: 5900, business: 14900, firstClass: null },
        seatFees: { aisle: 300, window: 300, extraLegroom: 900 },
        bookedSeats: 0,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-17T00:00:00Z'
      }
    ];
    this._flights.set(mockFlights);
  }

  // ==================== ROUTE CRUD ====================

  async createRoute(dto: CreateRouteDto): Promise<AirlineRoute> {
    return new Promise((resolve, reject) => {
      // Check for duplicates
      const exists = this._routes().some(r =>
        r.originAirport === dto.originAirport &&
        r.destinationAirport === dto.destinationAirport &&
        r.flightNumberPrefix === dto.flightNumberPrefix
      );

      if (exists) {
        reject(new Error('Route already exists'));
        return;
      }

      const newRoute: AirlineRoute = {
        id: `route-${String(this._routes().length + 1).padStart(3, '0')}`,
        airlineId: this.currentAirlineId,
        ...dto,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this._routes.update(routes => [...routes, newRoute]);
      resolve(newRoute);
    });
  }

  async updateRoute(id: string, dto: UpdateRouteDto): Promise<AirlineRoute> {
    return new Promise((resolve, reject) => {
      const index = this._routes().findIndex(r => r.id === id);
      if (index === -1) {
        reject(new Error('Route not found'));
        return;
      }

      const updated: AirlineRoute = {
        ...this._routes()[index],
        ...dto,
        updatedAt: new Date().toISOString()
      };

      this._routes.update(routes => {
        const newRoutes = [...routes];
        newRoutes[index] = updated;
        return newRoutes;
      });

      resolve(updated);
    });
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
    return new Promise((resolve, reject) => {
      // Check for duplicate registration
      const exists = this._aircraft().some(a => a.registration === dto.registration);
      if (exists) {
        reject(new Error('Aircraft with this registration already exists'));
        return;
      }

      const economyConfig = createSeatClassConfig(dto.economyConfig.rows, dto.economyConfig.seatsPerRow);
      const businessConfig = dto.businessConfig
        ? createSeatClassConfig(dto.businessConfig.rows, dto.businessConfig.seatsPerRow)
        : null;
      const firstClassConfig = dto.firstClassConfig
        ? createSeatClassConfig(dto.firstClassConfig.rows, dto.firstClassConfig.seatsPerRow)
        : null;

      const totalSeats = calculateTotalSeats(
        dto.economyConfig,
        dto.businessConfig,
        dto.firstClassConfig
      );

      const newAircraft: Aircraft = {
        id: `aircraft-${String(this._aircraft().length + 1).padStart(3, '0')}`,
        airlineId: this.currentAirlineId,
        model: dto.model,
        registration: dto.registration,
        economyConfig,
        businessConfig,
        firstClassConfig,
        totalSeats,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this._aircraft.update(aircraft => [...aircraft, newAircraft]);
      resolve(newAircraft);
    });
  }

  async updateAircraft(id: string, dto: UpdateAircraftDto): Promise<Aircraft> {
    return new Promise((resolve, reject) => {
      const index = this._aircraft().findIndex(a => a.id === id);
      if (index === -1) {
        reject(new Error('Aircraft not found'));
        return;
      }

      const current = this._aircraft()[index];

      const economyConfig = dto.economyConfig
        ? createSeatClassConfig(dto.economyConfig.rows, dto.economyConfig.seatsPerRow)
        : current.economyConfig;

      const businessConfig = dto.businessConfig !== undefined
        ? (dto.businessConfig ? createSeatClassConfig(dto.businessConfig.rows, dto.businessConfig.seatsPerRow) : null)
        : current.businessConfig;

      const firstClassConfig = dto.firstClassConfig !== undefined
        ? (dto.firstClassConfig ? createSeatClassConfig(dto.firstClassConfig.rows, dto.firstClassConfig.seatsPerRow) : null)
        : current.firstClassConfig;

      const totalSeats = calculateTotalSeats(
        economyConfig,
        businessConfig,
        firstClassConfig
      );

      const updated: Aircraft = {
        ...current,
        model: dto.model ?? current.model,
        registration: dto.registration ?? current.registration,
        economyConfig,
        businessConfig,
        firstClassConfig,
        totalSeats,
        isActive: dto.isActive ?? current.isActive,
        updatedAt: new Date().toISOString()
      };

      this._aircraft.update(aircraft => {
        const newAircraft = [...aircraft];
        newAircraft[index] = updated;
        return newAircraft;
      });

      resolve(updated);
    });
  }

  async toggleAircraftStatus(id: string): Promise<void> {
    const aircraft = this._aircraft().find(a => a.id === id);
    if (aircraft) {
      await this.updateAircraft(id, { isActive: !aircraft.isActive });
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
    return new Promise((resolve, reject) => {
      // Check for aircraft conflict
      const conflict = this.checkAircraftConflict(
        dto.aircraftId,
        dto.departureTime,
        dto.arrivalTime
      );

      if (conflict) {
        reject(new Error(`Aircraft conflict: ${conflict.flightNumber} at this time`));
        return;
      }

      const route = this.getRouteById(dto.routeId);
      if (!route) {
        reject(new Error('Route not found'));
        return;
      }

      const departure = new Date(dto.departureTime);
      const arrival = new Date(dto.arrivalTime);
      const durationMinutes = Math.round((arrival.getTime() - departure.getTime()) / 60000);

      const newFlight: AirlineFlight = {
        id: `flight-${String(this._flights().length + 1).padStart(3, '0')}`,
        airlineId: this.currentAirlineId,
        routeId: dto.routeId,
        aircraftId: dto.aircraftId,
        flightNumber: route.flightNumberPrefix,
        departureTime: dto.departureTime,
        arrivalTime: dto.arrivalTime,
        durationMinutes,
        status: 'scheduled',
        pricing: dto.pricing,
        seatFees: dto.seatFees,
        bookedSeats: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this._flights.update(flights => [...flights, newFlight]);
      resolve(newFlight);
    });
  }

  async updateFlight(id: string, dto: UpdateFlightDto): Promise<AirlineFlight> {
    return new Promise((resolve, reject) => {
      const index = this._flights().findIndex(f => f.id === id);
      if (index === -1) {
        reject(new Error('Flight not found'));
        return;
      }

      const current = this._flights()[index];

      if (current.status !== 'scheduled') {
        reject(new Error('Can only edit scheduled flights'));
        return;
      }

      // Check for conflict if aircraft or times changed
      if (dto.aircraftId || dto.departureTime || dto.arrivalTime) {
        const conflict = this.checkAircraftConflict(
          dto.aircraftId ?? current.aircraftId,
          dto.departureTime ?? current.departureTime,
          dto.arrivalTime ?? current.arrivalTime,
          id
        );

        if (conflict) {
          reject(new Error(`Aircraft conflict: ${conflict.flightNumber}`));
          return;
        }
      }

      const departure = new Date(dto.departureTime ?? current.departureTime);
      const arrival = new Date(dto.arrivalTime ?? current.arrivalTime);
      const durationMinutes = Math.round((arrival.getTime() - departure.getTime()) / 60000);

      const updated: AirlineFlight = {
        ...current,
        ...dto,
        durationMinutes,
        updatedAt: new Date().toISOString()
      };

      this._flights.update(flights => {
        const newFlights = [...flights];
        newFlights[index] = updated;
        return newFlights;
      });

      resolve(updated);
    });
  }

  async updateFlightStatus(id: string, status: FlightStatus): Promise<void> {
    const index = this._flights().findIndex(f => f.id === id);
    if (index !== -1) {
      this._flights.update(flights => {
        const newFlights = [...flights];
        newFlights[index] = {
          ...newFlights[index],
          status,
          updatedAt: new Date().toISOString()
        };
        return newFlights;
      });
    }
  }

  async cancelFlight(id: string): Promise<void> {
    await this.updateFlightStatus(id, 'cancelled');
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

      // Check for overlap
      return !(arrivalTime <= flightDeparture || departureTime >= flightArrival);
    }) ?? null;
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

  // ==================== PRICING ====================

  async updateFlightPricing(id: string, pricing: FlightPricing): Promise<void> {
    await this.updateFlight(id, { pricing });
  }

  async bulkUpdatePricing(ids: string[], pricing: FlightPricing): Promise<void> {
    for (const id of ids) {
      await this.updateFlightPricing(id, pricing);
    }
  }

  // ==================== STATISTICS ====================

  async getStatistics(dateRange: DateRange): Promise<AirlineStats> {
    return new Promise(resolve => {
      // Simulate API delay
      setTimeout(() => {
        resolve(getStatsByDateRange(dateRange));
      }, 500);
    });
  }
}
