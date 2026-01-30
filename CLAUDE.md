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

### Dependency Graph
```
SPEC-001A (Header/Footer)
    ↓
SPEC-001B (Search Form)
    ↓
SPEC-001C (Landing Content) ←──┐
    ↓                          │
SPEC-002A (Flight Results) ────┘
    ↓
SPEC-002B (Sidebar/Hotels)
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
├── 000-spec-plan.md      # Overview
├── 001A-header-footer.md
├── 001B-search-form.md
├── 001C-landing-content.md
├── 002A-search-flights.md
└── 002B-search-sidebar.md
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
