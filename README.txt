# SkyRoute - Flight Booking Application
# TAW 2024/2025 - Tecnologie e Applicazioni Web
# Ca' Foscari University Venice

## Prerequisites

- Docker Engine 20.10+
- Docker Compose V2+

## Running the Application

1. Clone the repository (if not already done)

2. Copy environment file:
   cp .env.example .env

3. Start all services:
   docker-compose up --build

4. Wait for all containers to be healthy (approximately 2-3 minutes)

5. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

## Test Accounts

ADMIN:
  admin@skyroute.com / admin123

AIRLINE OPERATORS (password: operator123):
  Turkish Airlines:  operator@turkishairlines.com
  Emirates:          operator@emirates.com
  Lufthansa:         operator@lufthansa.com
  British Airways:   operator@ba.com
  Delta:             operator@delta.com
  United:            operator@united.com

PASSENGERS (password: passenger123):
  john.doe@gmail.com
  jane.smith@gmail.com
  alex.wilson@gmail.com
  maria.garcia@gmail.com
  david.brown@gmail.com
  emma.johnson@gmail.com
  oliver.taylor@gmail.com
  sophia.anderson@gmail.com
  lucas.martinez@gmail.com
  mia.thomas@gmail.com
  mehmet.ozturk@gmail.com
  ayse.demir@gmail.com

## Common Commands

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Fresh start (removes all data)
docker-compose down -v
docker-compose up --build

# Check container status
docker-compose ps

## Troubleshooting

If ports are already in use, modify the .env file:
FRONTEND_PORT=4201
BACKEND_PORT=3001
MONGODB_PORT=27018

Then restart: docker-compose down && docker-compose up

## Project Structure

flight-booking/
├── frontend/          # Angular 17+ SPA
├── backend/           # Node.js + Express + TypeScript API
├── docker-compose.yml # Container orchestration (3 containers)
├── REPORT.md          # Technical documentation
├── INDIVIDUAL_REPORT.md # Individual student report
└── .env.example       # Environment template
