# Tripma - Flight Booking Application
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

4. Wait for all containers to be healthy (approximately 2 minutes)

5. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

## Test Accounts

Admin:
- Email: admin@tripma.com
- Password: admin123

Passenger:
- Email: test@example.com
- Password: password123

Airline (Hawaiian Airlines):
- Email: hawaiian@airline.com
- Password: airline123

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
├── frontend/          # Angular SPA
├── backend/           # Node.js + Express API
├── docker-compose.yml # Container orchestration
└── .env.example       # Environment template
