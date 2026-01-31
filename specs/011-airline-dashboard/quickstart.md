# Quickstart: 011-airline-dashboard

**Date**: 2025-01-31
**Estimated Tasks**: ~25-30 tasks
**Estimated Components**: 15-18 components

---

## Prerequisites

1. ✅ 010-auth implemented (airline role support)
2. ✅ Angular 17+ project setup
3. ⚠️ Install additional dependencies:

```bash
cd frontend
npm install ng2-charts chart.js date-fns
```

---

## Implementation Order

### Phase 1: Foundation (~5 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 1 | Create airline models | `models/airline-route.model.ts`, `models/aircraft.model.ts`, `models/airline-stats.model.ts` | P0 |
| 2 | Create mock data | `mock-data/airline-routes.data.ts`, `mock-data/aircraft.data.ts`, `mock-data/airline-stats.data.ts` | P0 |
| 3 | Create AirlineService | `services/airline.service.ts` | P0 |
| 4 | Create airline guard | `guards/airline.guard.ts` | P0 |
| 5 | Create airline dashboard container | `pages/airline/airline.ts`, `.html`, `.scss`, `.routes.ts` | P0 |

### Phase 2: Navigation & Layout (~3 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 6 | Create sidebar component | `components/airline/sidebar/` | P0 |
| 7 | Create overview page | `pages/airline/overview/` | P1 |
| 8 | Add airline routes to app.routes.ts | `app.routes.ts` | P0 |

### Phase 3: Route Management (~4 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 9 | Create routes list page | `pages/airline/routes/routes-list/` | P1 |
| 10 | Create route form (create/edit) | `pages/airline/routes/route-form/` | P1 |
| 11 | Implement route CRUD in service | `services/airline.service.ts` | P1 |
| 12 | Add confirmation dialog component | `components/airline/confirmation-dialog/` | P1 |

### Phase 4: Aircraft Management (~4 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 13 | Create aircraft list page | `pages/airline/aircraft/aircraft-list/` | P1 |
| 14 | Create aircraft form | `pages/airline/aircraft/aircraft-form/` | P1 |
| 15 | Create seat config builder | `components/airline/seat-config-builder/` | P1 |
| 16 | Implement aircraft CRUD in service | `services/airline.service.ts` | P1 |

### Phase 5: Flight Scheduling (~5 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 17 | Create flights list page | `pages/airline/flights/flights-list/` | P1 |
| 18 | Create flight form | `pages/airline/flights/flight-form/` | P1 |
| 19 | Implement flight CRUD in service | `services/airline.service.ts` | P1 |
| 20 | Add conflict detection logic | `services/airline.service.ts` | P1 |
| 21 | Create simple calendar view | `pages/airline/flights/flights-calendar/` | P2 |

### Phase 6: Pricing Management (~2 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 22 | Create pricing list page | `pages/airline/pricing/pricing-list/` | P1 |
| 23 | Implement inline editing & bulk pricing | `pages/airline/pricing/pricing-list/` | P1 |

### Phase 7: Statistics Dashboard (~4 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 24 | Create stat card component | `components/airline/stat-card/` | P1 |
| 25 | Create statistics page with charts | `pages/airline/statistics/` | P1 |
| 26 | Implement date range filter | `pages/airline/statistics/` | P2 |
| 27 | Add CSV export functionality | `pages/airline/statistics/` | P2 |

### Phase 8: Polish (~2 tasks)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 28 | Add loading states & error handling | All pages | P2 |
| 29 | Final testing & build verification | - | P1 |

---

## Key Patterns to Follow

### Component Structure
```typescript
// pages/airline/routes/routes-list/routes-list.ts
@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ...],
  templateUrl: './routes-list.html',
  styleUrl: './routes-list.scss'
})
export class RoutesList {
  private airlineService = inject(AirlineService);

  routes = this.airlineService.routes;
  searchTerm = signal('');

  filteredRoutes = computed(() =>
    this.routes().filter(r =>
      r.flightNumberPrefix.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );
}
```

### Service Pattern
```typescript
// services/airline.service.ts
@Injectable({ providedIn: 'root' })
export class AirlineService {
  private routes = signal<AirlineRoute[]>(MOCK_AIRLINE_ROUTES);

  readonly routesList = this.routes.asReadonly();

  createRoute(dto: CreateRouteDto): Promise<AirlineRoute> {
    return new Promise((resolve, reject) => {
      // Check duplicates
      const exists = this.routes().some(r =>
        r.originAirport === dto.originAirport &&
        r.destinationAirport === dto.destinationAirport
      );
      if (exists) {
        reject(new Error('Route already exists'));
        return;
      }

      const newRoute: AirlineRoute = {
        id: crypto.randomUUID(),
        ...dto,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.routes.update(routes => [...routes, newRoute]);
      resolve(newRoute);
    });
  }
}
```

---

## Testing Checklist

- [ ] Can navigate to `/airline` (redirects to login if not authenticated)
- [ ] Can navigate to `/airline` as airline user (sees dashboard)
- [ ] Can create a new route
- [ ] Cannot create duplicate route
- [ ] Can view routes list with search
- [ ] Can deactivate route
- [ ] Can register aircraft with seat configuration
- [ ] Can schedule a flight
- [ ] Flight conflict detection works
- [ ] Can set flight pricing
- [ ] Price validation works (business > economy)
- [ ] Statistics page shows charts
- [ ] Can export statistics to CSV
- [ ] Build succeeds with no errors

---

## Next Command

After reading this quickstart, run:

```
/speckit.tasks
```

to generate the detailed task breakdown.
