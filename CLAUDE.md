# Flight Booking Web Application

## Project Overview
A flight booking web application for the "Tecnologie e Applicazioni Web" course (2024/2025) at Ca' Foscari University Venice.

## Tech Stack
- **Backend:** Node.js + Express.js + TypeScript
- **Database:** MongoDB
- **Frontend:** Angular 17+ (SPA)
- **Containerization:** Docker (3 separate containers)

## User Roles
1. **Admin** - Created programmatically on first backend run
2. **Airline** - Invited by admin, must change password on first login
3. **Passenger** - Can self-register

## Design Reference
- **Figma:** Tripma Flight Booking Web App
- https://www.figma.com/community/file/911320742349428744
- Figma assets stored in: `frontend/design/`

---

## 🔴 SPEC-DRIVEN WORKFLOW (MUST READ FIRST)

### Development Order
1. **Frontend First** - All UI specs are created and implemented before backend
2. **Backend Second** - API specs are derived from frontend needs
3. **Each spec → max 400 lines of code**

### Spec Structure
```
.speckit/specs/
├── frontend/
│   ├── 001-landing-page.md
│   ├── 002-flight-search.md
│   ├── 003-search-results.md
│   ├── 004-flight-details.md
│   ├── 005-seat-selection.md
│   ├── 006-passenger-info.md
│   ├── 007-payment.md
│   ├── 008-booking-confirmation.md
│   ├── 009-auth-login.md
│   ├── 010-auth-register.md
│   ├── 011-passenger-dashboard.md
│   ├── 012-airline-dashboard.md
│   ├── 013-airline-routes.md
│   ├── 014-airline-flights.md
│   ├── 015-airline-statistics.md
│   ├── 016-admin-panel.md
│   └── ...
└── backend/
    ├── 101-auth-api.md
    ├── 102-flights-api.md
    ├── 103-bookings-api.md
    ├── 104-airlines-api.md
    ├── 105-admin-api.md
    └── ...
```

### Spec File Format
Each spec MUST include:
```markdown
# SPEC-XXX: [Feature Name]

## Overview
Brief description of what this spec implements.

## Dependencies
- Requires: SPEC-XXX (if any)
- Required by: SPEC-XXX (if any)
- Backend API: SPEC-1XX (for frontend specs)

## Files to Create/Modify
| File Path | Purpose | Lines (est.) |
|-----------|---------|--------------|
| src/app/components/xxx/xxx.component.ts | Component logic | ~80 |
| src/app/components/xxx/xxx.component.html | Template | ~60 |
| src/app/components/xxx/xxx.component.scss | Styles | ~40 |

## User Stories
- As a [user], I want to [action] so that [benefit]

## UI Elements (from Figma)
- List of UI components and their behaviors

## API Calls (for frontend specs)
| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### When Starting a New Spec
1. **READ** the spec file completely
2. **RUN** `/speckit.clarify` if anything is unclear
3. **IMPLEMENT** only what's in the spec
4. **MAX 400 lines** per spec - split if larger

### Commands
```bash
# Create/update spec
/speckit.specify

# Ask clarifying questions
/speckit.clarify

# Generate implementation plan
/speckit.plan

# Generate task list
/speckit.tasks

# Execute implementation
/speckit.implement
```

---

## Project Structure
```
flight-booking/
├── .speckit/
│   ├── spec.md              # Main project spec
│   ├── plan.md              # Implementation plan
│   ├── tasks.md             # Task tracking
│   └── specs/
│       ├── frontend/        # Frontend page specs (001-099)
│       └── backend/         # Backend API specs (101-199)
├── frontend/
│   ├── design/              # Figma exports
│   └── src/
│       └── app/
│           ├── components/
│           ├── services/
│           ├── models/
│           └── pages/
├── backend/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       ├── middleware/
│       └── services/
├── docker-compose.yml
└── README.txt
```

---

## Core Features

### Flight Search (Anonymous)
- Search flights between two cities
- Up to 1 intermediate stop allowed
- Minimum 2 hours transfer time
- Sort by: price, duration, stops

### Booking Flow (Authenticated)
1. Select flight → 2. Choose seats → 3. Add extras → 4. Payment → 5. Confirmation

### Airline Features
- Manage routes, aircrafts, flights
- Set ticket prices (economy/business/first)
- View statistics (passengers, revenue, popular routes)

### Admin Features
- Invite airlines (temporary password)
- Delete users

### Real-time Features
- WebSocket for seat availability updates

---

## Important Notes
- All specs are in English
- Backend must preload test data on first run
- Real-time seat availability required (WebSocket)
- First login for airlines requires password change

## Docker Commands
```bash
# Start all services
docker-compose up

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && ng serve
```
