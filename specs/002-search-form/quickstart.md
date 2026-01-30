# Quickstart: Flight Search Form

**Branch**: `002-search-form` | **Date**: 2025-01-30

## Prerequisites

- Node.js 18+
- Angular CLI 17+
- Running frontend dev server

## Quick Verification

```bash
# Start frontend
cd frontend
ng serve

# Open browser
open http://localhost:4200
```

## Component Usage

### Basic Usage in Template

```html
<app-search-form
  (search)="onSearch($event)">
</app-search-form>
```

### With Initial Values

```html
<app-search-form
  [initialCriteria]="savedCriteria"
  (search)="onSearch($event)">
</app-search-form>
```

### In Landing Page

```typescript
// landing.component.ts
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchCriteria } from '../../models/search-criteria.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SearchFormComponent],
  template: `
    <div class="hero">
      <h1>Find your next adventure</h1>
      <app-search-form (search)="handleSearch($event)" />
    </div>
  `
})
export class LandingComponent {
  handleSearch(criteria: SearchCriteria): void {
    // Navigate to search results with query params
    this.router.navigate(['/search'], {
      queryParams: this.searchService.toQueryParams(criteria)
    });
  }
}
```

## Key Files

| File | Purpose |
|------|---------|
| `components/search-form/search-form.component.ts` | Main form component |
| `components/search-form/location-input/` | Airport autocomplete |
| `components/search-form/date-picker/` | Date selection |
| `components/search-form/passenger-selector/` | Passenger count |
| `models/search-criteria.model.ts` | TypeScript interfaces |
| `services/airport.service.ts` | Airport data provider |
| `assets/data/airports.json` | Mock airport data |

## Testing

```bash
# Run component tests
ng test --include='**/search-form/**'

# Run all tests
ng test
```

## Common Tasks

### Add New Airport

Edit `frontend/src/assets/data/airports.json`:

```json
{
  "code": "SAW",
  "name": "Sabiha Gokcen International",
  "city": "Istanbul",
  "country": "Turkey"
}
```

### Change Autocomplete Trigger

Edit `location-input.component.ts`:

```typescript
// Change minimum characters for autocomplete
private readonly MIN_SEARCH_LENGTH = 2; // Currently 2
```

### Modify Validation Rules

Edit `search-form.component.ts`:

```typescript
// Add custom validators in form initialization
this.form = this.fb.group({
  // ... fields
}, { validators: [this.validateDates, this.validateLocations] });
```
