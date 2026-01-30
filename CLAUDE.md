# Flight Booking Web Application

## Project Overview
A flight booking web application for the "Tecnologie e Applicazioni Web" course (2024/2025) at Ca' Foscari University Venice.

## Tech Stack
- **Backend:** Node.js + Express.js + TypeScript
- **Database:** MongoDB
- **Frontend:** Angular 17+ (SPA)
- **Containerization:** Docker (3 separate containers)

## Design Reference
- **Figma:** Tripma Flight Booking Web App
- https://www.figma.com/community/file/911320742349428744
- Assets: `frontend/design/images/`
- Mapping: `frontend/design/IMAGE-MAPPING.md`

---

## 🔴 SPECKIT WORKFLOW (MUST READ FIRST)

### When `/speckit.specify` is called:

1. **ALWAYS** read the spec file from `.speckit/specs/frontend/` first
2. **LOOK** at the "Files to Create" table - these are EXACT files to generate
3. **CHECK** dependencies - implement required specs first
4. **USE** mock data from `src/app/mock-data/` (not real API)
5. **FOLLOW** the Figma design exactly
6. **MAX 400 lines** total per spec

### When `/speckit.clarify` is called:

1. Read the current spec file
2. Ask questions about unclear parts
3. Update spec file with answers

### When `/speckit.implement` is called:

1. Read the spec file completely
2. Create ALL files listed in "Files to Create" table
3. Use Angular CLI conventions
4. Import mock data, not real API calls
5. Match Figma design pixel-perfect

---

## Current Specs (Implementation Order)

| Order | Spec ID | Name | Status | Lines |
|-------|---------|------|--------|-------|
| 1 | SPEC-001A | Header + Footer | ⬜ Pending | ~100 |
| 2 | SPEC-001B | Search Form Components | ⬜ Pending | ~200 |
| 3 | SPEC-001C | Landing Page Content | ⬜ Pending | ~250 |
| 4 | SPEC-002A | Search Results - Flights | ⬜ Pending | ~200 |
| 5 | SPEC-002B | Search Results - Sidebar | ⬜ Pending | ~200 |
| 6 | SPEC-003A | Passenger Information | ⬜ Pending | ~200 |
| 7 | SPEC-003B | Seat Selection | ⬜ Pending | ~250 |
| 8 | SPEC-003C | Payment Method | ⬜ Pending | ~200 |
| 9 | SPEC-003D | Booking Confirmation | ⬜ Pending | ~200 |
| 10 | SPEC-004A | Auth (Login/Register) | ⬜ Pending | ~150 |

### Dependency Graph
```
SPEC-001A (Header/Footer)
    │
    ├──► SPEC-001B (Search Form)
    │        │
    │        ├──► SPEC-001C (Landing Page)
    │        │
    │        └──► SPEC-002A (Search Results - Flights)
    │                  │
    │                  └──► SPEC-002B (Search Results - Bottom)
    │
    └──► SPEC-004A (Auth Login/Register)
              │
              └──► SPEC-003A (Passenger Info)
                        │
                        └──► SPEC-003B (Seat Selection)
                                  │
                                  └──► SPEC-003C (Payment Method)
                                            │
                                            └──► SPEC-003D (Confirmation)
```

---

## Project Structure

```
frontend/
├── design/
│   ├── images/
│   │   ├── landing/        # 10 images
│   │   └── search-results/ # 6 images
│   └── IMAGE-MAPPING.md
└── src/
    └── app/
        ├── pages/
        │   ├── landing/
        │   └── search-results/
        ├── shared/
        │   ├── header/
        │   ├── footer/
        │   ├── search-form/
        │   ├── airport-autocomplete/
        │   ├── date-picker/
        │   └── passenger-selector/
        ├── components/
        │   ├── destination-card/
        │   ├── flight-card/
        │   ├── hotel-card/
        │   └── ...
        ├── mock-data/
        │   ├── airports.ts
        │   ├── flights.ts
        │   ├── airlines.ts
        │   └── destinations.ts
        └── models/
            ├── airport.model.ts
            ├── flight.model.ts
            └── ...
```

---

## Spec Files Location

```
.speckit/specs/frontend/
├── 000-spec-plan.md          # Overview & TAW requirements
├── 001A-header-footer.md     # Header + Footer
├── 001B-search-form.md       # Search form + sub-components
├── 001C-landing-content.md   # Landing page content
├── 002A-search-flights.md    # Search results - flight list
├── 002B-search-sidebar.md    # Search results - sidebar/bottom
├── 003A-passenger-info.md    # Passenger information form
├── 003B-seat-selection.md    # Aircraft seat map
├── 003C-payment.md           # Payment method
├── 003D-confirmation.md      # Booking confirmation
└── 004A-auth.md              # Login/Register
```

---

## Mock Data Strategy

All frontend specs use mock data. Backend integration comes later.

```typescript
// Example usage in component
import { AIRPORTS } from '@app/mock-data/airports';
import { MOCK_FLIGHTS } from '@app/mock-data/flights';
```

---

## Angular CLI Commands

```bash
# Generate component
ng generate component shared/header --standalone

# Generate service
ng generate service services/flight

# Start dev server
ng serve
```

---

## Important Rules

1. **NO real API calls** in frontend specs - use mock data
2. **Each spec < 400 lines** - split if larger
3. **Follow Figma exactly** - check `frontend/design/`
4. **Standalone components** - Angular 17+ style
5. **SCSS for styles** - not CSS
6. **English only** - all code and comments

## Active Technologies
- TypeScript 5.x with Angular 17+ (standalone components), RxJS, Angular Router
- SCSS for component styling
- CSS Grid for responsive layouts

## Recent Changes
- 005-search-sidebar: Planning artifacts created (plan.md, research.md, data-model.md, quickstart.md)
- 004-search-results: Implemented search results page with flight list, filters, compact search form
- 003-landing-content: Planning artifacts created (plan.md, research.md, data-model.md, quickstart.md)
- 002-search-form: Implemented flight search form with location autocomplete, date pickers, passenger selector
