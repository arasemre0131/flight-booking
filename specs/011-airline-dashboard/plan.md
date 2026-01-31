# Implementation Plan: 011-airline-dashboard

**Date**: 2025-01-31
**Branch**: `011-airline-dashboard`
**Status**: PLANNED

---

## Technical Context

| Aspect | Value |
|--------|-------|
| Framework | Angular 17+ (standalone components) |
| State Management | Angular Signals |
| UI Components | Angular Material + custom SCSS |
| Charts | Chart.js with ng2-charts |
| Forms | Reactive Forms |
| Routing | Angular Router (lazy loading) |
| Mock Data | In-memory signal-based services |

---

## Constitution Check

No project constitution file found. Using standard Angular patterns from existing codebase.

**Patterns to Follow** (from existing pages):
- Standalone components with imports array
- Signal-based state in services
- SCSS for component styles
- Reactive forms for user input
- Mock data in `/mock-data/` directory
- Models in `/models/` directory
- Services in `/services/` directory

---

## File Structure

```
frontend/src/app/
├── pages/
│   └── airline/                          # Main airline dashboard
│       ├── airline.ts                    # Dashboard container with router-outlet
│       ├── airline.html
│       ├── airline.scss
│       ├── airline.routes.ts             # Child routes
│       ├── overview/                     # Overview/home page
│       │   ├── overview.ts
│       │   ├── overview.html
│       │   └── overview.scss
│       ├── routes/                       # Route management
│       │   ├── routes-list/
│       │   └── route-form/
│       ├── aircraft/                     # Aircraft management
│       │   ├── aircraft-list/
│       │   └── aircraft-form/
│       ├── flights/                      # Flight scheduling
│       │   ├── flights-list/
│       │   ├── flight-form/
│       │   └── flights-calendar/
│       ├── pricing/                      # Pricing management
│       │   └── pricing-list/
│       └── statistics/                   # Statistics dashboard
│           └── statistics.ts
├── components/
│   └── airline/
│       ├── sidebar/                      # Dashboard sidebar navigation
│       ├── stat-card/                    # Reusable stat card
│       ├── seat-config-builder/          # Visual seat configuration
│       └── confirmation-dialog/          # Reusable confirmation modal
├── models/
│   ├── airline-route.model.ts
│   ├── aircraft.model.ts
│   └── airline-stats.model.ts
├── services/
│   └── airline.service.ts                # All airline CRUD operations
└── mock-data/
    ├── airline-routes.data.ts
    ├── aircraft.data.ts
    └── airline-stats.data.ts
```

---

## Implementation Phases

### Phase 1: Foundation (Setup & Navigation)
- Create airline page container with sidebar
- Set up child routing
- Create sidebar navigation component
- Add route guard for airline role

### Phase 2: Route Management
- Create routes list component
- Create route form (create/edit)
- Implement mock data service for routes
- Add search/filter functionality

### Phase 3: Aircraft Management
- Create aircraft list component
- Create aircraft form with seat configuration
- Build visual seat config builder
- Implement validation rules

### Phase 4: Flight Scheduling
- Create flights list with filters
- Create flight form (route + aircraft + datetime)
- Implement conflict detection
- Add simple calendar view

### Phase 5: Pricing Management
- Create pricing list with inline editing
- Implement bulk pricing
- Add price validation

### Phase 6: Statistics Dashboard
- Install and configure Chart.js
- Create stat cards component
- Implement charts (bar, line, pie)
- Add CSV export functionality

---

## Dependencies to Install

```bash
npm install ng2-charts chart.js date-fns
```

---

## Route Configuration

```typescript
// app.routes.ts addition
{
  path: 'airline',
  loadChildren: () => import('./pages/airline/airline.routes').then(m => m.AIRLINE_ROUTES),
  canActivate: [airlineGuard]
}

// airline.routes.ts
export const AIRLINE_ROUTES: Routes = [
  {
    path: '',
    component: AirlineDashboard,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./overview/overview').then(m => m.Overview) },
      { path: 'routes', loadComponent: () => import('./routes/routes-list/routes-list').then(m => m.RoutesList) },
      { path: 'routes/new', loadComponent: () => import('./routes/route-form/route-form').then(m => m.RouteForm) },
      { path: 'routes/:id/edit', loadComponent: () => import('./routes/route-form/route-form').then(m => m.RouteForm) },
      { path: 'aircraft', loadComponent: () => import('./aircraft/aircraft-list/aircraft-list').then(m => m.AircraftList) },
      { path: 'aircraft/new', loadComponent: () => import('./aircraft/aircraft-form/aircraft-form').then(m => m.AircraftForm) },
      { path: 'aircraft/:id/edit', loadComponent: () => import('./aircraft/aircraft-form/aircraft-form').then(m => m.AircraftForm) },
      { path: 'flights', loadComponent: () => import('./flights/flights-list/flights-list').then(m => m.FlightsList) },
      { path: 'flights/new', loadComponent: () => import('./flights/flight-form/flight-form').then(m => m.FlightForm) },
      { path: 'flights/:id/edit', loadComponent: () => import('./flights/flight-form/flight-form').then(m => m.FlightForm) },
      { path: 'pricing', loadComponent: () => import('./pricing/pricing-list/pricing-list').then(m => m.PricingList) },
      { path: 'statistics', loadComponent: () => import('./statistics/statistics').then(m => m.Statistics) }
    ]
  }
];
```

---

## Key Components

### AirlineService (Signal-based)

```typescript
@Injectable({ providedIn: 'root' })
export class AirlineService {
  // State signals
  routes = signal<AirlineRoute[]>([]);
  aircraft = signal<Aircraft[]>([]);
  flights = signal<Flight[]>([]);

  // Computed
  activeRoutes = computed(() => this.routes().filter(r => r.isActive));
  activeAircraft = computed(() => this.aircraft().filter(a => a.isActive));

  // CRUD operations
  createRoute(route: CreateRouteDto): Promise<AirlineRoute>;
  updateRoute(id: string, route: UpdateRouteDto): Promise<AirlineRoute>;
  deleteRoute(id: string): Promise<void>;
  // ... similar for aircraft and flights

  // Statistics
  getStatistics(dateRange: DateRange): Promise<AirlineStats>;
}
```

---

## Validation Rules

| Entity | Rule | Implementation |
|--------|------|----------------|
| Route | Unique origin-destination-flightNumber | Service-level check before create |
| Aircraft | Registration unique | Service-level check |
| Aircraft | At least 1 seat class configured | Form validation |
| Flight | No aircraft conflicts | Service checks all flights for aircraft |
| Flight | Arrival > Departure | Form validation |
| Pricing | business > economy > 0 | Form validation |
| Pricing | firstClass > business (if set) | Form validation |

---

## Success Metrics Mapping

| Criteria | Implementation |
|----------|----------------|
| Routes < 2 min | 3-field form with autocomplete |
| Aircraft < 3 min | Visual builder, auto-calculate totals |
| Flights < 2 min | Dropdowns pre-populated |
| Search < 1 sec | Client-side filtering |
| Stats < 3 sec | Mock data, optimize chart rendering |
| Zero data loss | Confirmation dialogs, soft deletes |
| Clear validation | Inline errors, disabled submit until valid |
