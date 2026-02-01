# Quickstart: Docker Infrastructure Setup

## Prerequisites

- Docker Engine 20.10+
- Docker Compose V2+
- 4GB RAM minimum
- 10GB disk space

## Quick Start

```bash
# Clone and navigate to project
cd flight-booking

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

## Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000 |
| MongoDB | localhost:27017 |

## Common Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v

# Rebuild after code changes
docker-compose up --build

# Check service status
docker-compose ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

## Verification Steps

1. **Check all containers running**:
   ```bash
   docker-compose ps
   # Should show 3 services: frontend, backend, mongodb
   ```

2. **Test frontend**:
   - Open http://localhost:4200
   - Should see the Tripma landing page

3. **Test backend**:
   ```bash
   curl http://localhost:3000/api/health
   # Should return: {"status":"ok"}
   ```

4. **Test MongoDB**:
   ```bash
   docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
   # Should return: { ok: 1 }
   ```

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :4200
lsof -i :3000
lsof -i :27017

# Kill the process or change port in .env
```

### Container won't start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Database connection issues
```bash
# Verify MongoDB is healthy
docker-compose ps
docker-compose logs mongodb

# Check network connectivity
docker-compose exec backend ping mongodb
```

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tripma.com | admin123 |
| Passenger | test@example.com | password123 |
