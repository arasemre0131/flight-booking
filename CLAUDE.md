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

## Project Structure
```
flight-booking/
├── .speckit/
│   └── specs/
│       ├── frontend/     # Frontend page specs
│       └── backend/      # Backend API specs
├── frontend/             # Angular application
├── backend/              # Node.js + Express API
├── docker-compose.yml
└── README.txt
```

## Spec Workflow
1. Frontend specs define UI pages and user interactions
2. Backend specs define APIs that support frontend functionality
3. Each frontend action maps to a backend endpoint

## Design Reference
- Figma: Tripma Flight Booking Web App
- https://www.figma.com/community/file/911320742349428744

## Commands
```bash
# Start all services
docker-compose up

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && ng serve
```

## Important Notes
- All specs are in English
- Backend must preload test data on first run
- Real-time seat availability required (WebSocket)
- Flight search allows up to 1 intermediate stop (min 2h transfer time)
