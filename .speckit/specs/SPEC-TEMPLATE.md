# SPEC-XXX: [Feature Name]

> **Max Lines:** 400 | **Type:** Frontend/Backend | **Status:** Draft

## Overview
Brief description of what this spec implements.

## Dependencies
| Type | Spec ID | Description |
|------|---------|-------------|
| Requires | SPEC-XXX | Must be completed first |
| Required by | SPEC-XXX | Depends on this spec |
| Backend API | SPEC-1XX | API endpoints needed |

## Files to Create/Modify

| File Path | Purpose | Est. Lines |
|-----------|---------|------------|
| `src/app/pages/xxx/xxx.component.ts` | Component logic | ~80 |
| `src/app/pages/xxx/xxx.component.html` | Template | ~60 |
| `src/app/pages/xxx/xxx.component.scss` | Styles | ~40 |
| `src/app/services/xxx.service.ts` | API service | ~50 |
| `src/app/models/xxx.model.ts` | Data models | ~20 |

**Total Estimated Lines:** ~250

## User Stories

```gherkin
As a [passenger/airline/admin]
I want to [action]
So that [benefit]
```

## Figma Reference
- **Frame:** [Frame name from Figma]
- **Page:** [Page number/name]
- **Components Used:**
  - Button (primary/secondary)
  - Input field
  - Card
  - etc.

## UI Elements

### Layout
```
+----------------------------------+
|           Header/Nav             |
+----------------------------------+
|                                  |
|         Main Content             |
|                                  |
+----------------------------------+
|            Footer                |
+----------------------------------+
```

### Components
| Component | Description | Behavior |
|-----------|-------------|----------|
| SearchForm | Flight search inputs | Validates dates, cities |
| FlightCard | Displays flight info | Click to select |

## Data Models

```typescript
interface Example {
  id: string;
  name: string;
  // ...
}
```

## API Calls (Frontend Specs)

| Action | Method | Endpoint | Request Body | Response |
|--------|--------|----------|--------------|----------|
| Search flights | GET | `/api/flights/search` | Query params | Flight[] |
| Book flight | POST | `/api/bookings` | BookingRequest | Booking |

## API Endpoints (Backend Specs)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/xxx` | None | Get all items |
| POST | `/api/xxx` | JWT | Create item |

## State Management
- Local component state for form inputs
- Service for API calls
- Observable for real-time updates (if needed)

## Validation Rules
| Field | Rule | Error Message |
|-------|------|---------------|
| email | Valid email format | "Invalid email address" |
| date | Future date only | "Select a future date" |

## Error Handling
| Error Code | User Message | Action |
|------------|--------------|--------|
| 401 | "Please log in" | Redirect to login |
| 404 | "Flight not found" | Show error message |

## Acceptance Criteria

- [ ] UI matches Figma design
- [ ] All form validations work
- [ ] API integration complete
- [ ] Loading states implemented
- [ ] Error handling works
- [ ] Responsive design (mobile/desktop)
- [ ] Accessibility (keyboard nav, ARIA)

## Notes
- Additional implementation notes
- Edge cases to consider
- Performance considerations
