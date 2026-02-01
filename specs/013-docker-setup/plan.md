# Implementation Plan: Docker Infrastructure Setup

**Feature ID**: 013-docker-setup
**Created**: 2026-02-01
**Status**: Planning

---

## Technical Context

### Technology Stack
- **Container Runtime**: Docker Engine 20.10+
- **Orchestration**: Docker Compose V2+
- **Frontend Base**: Node.js 20 (build) + Nginx (serve)
- **Backend Base**: Node.js 20
- **Database**: MongoDB 7.0

### Integration Points
- Frontend → Backend: HTTP API calls (port 3000)
- Backend → MongoDB: MongoDB driver (port 27017)
- Host → Frontend: Browser access (port 4200)
- Host → Backend: API access (port 3000)
- Host → MongoDB: Database tools (port 27017)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Frontend   │  │   Backend   │  │   MongoDB   │     │
│  │   (nginx)   │──│  (node.js)  │──│   (mongo)   │     │
│  │   :4200     │  │   :3000     │  │   :27017    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│         │                │                │             │
└─────────│────────────────│────────────────│─────────────┘
          │                │                │
    ┌─────┴────┐    ┌──────┴────┐    ┌──────┴────┐
    │ Host:4200│    │ Host:3000 │    │Host:27017 │
    └──────────┘    └───────────┘    └───────────┘
```

---

## Implementation Phases

### Phase 1: Docker Compose Setup
1. Create `docker-compose.yml` with 3 services
2. Define shared network
3. Configure environment variables
4. Set up volume for MongoDB persistence

### Phase 2: Frontend Dockerfile
1. Multi-stage build (build + serve)
2. Stage 1: Node.js builds Angular app
3. Stage 2: Nginx serves static files
4. Configure nginx for SPA routing

### Phase 3: Backend Dockerfile
1. Node.js base image
2. Install dependencies
3. Copy source code
4. Configure startup command
5. Health check endpoint

### Phase 4: Environment & Configuration
1. Create `.env.example` with all variables
2. Create `.dockerignore` files
3. Document configuration options

### Phase 5: Testing & Verification
1. Test `docker-compose up`
2. Verify all services start
3. Test inter-service communication
4. Test data persistence
5. Test clean restart

---

## File Structure

```
flight-booking/
├── docker-compose.yml          # Main orchestration file
├── .env.example                 # Environment template
├── .dockerignore               # Root ignore file
├── frontend/
│   ├── Dockerfile              # Frontend container build
│   ├── .dockerignore           # Frontend ignore file
│   └── nginx.conf              # Nginx configuration
└── backend/
    ├── Dockerfile              # Backend container build
    └── .dockerignore           # Backend ignore file
```

---

## Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://mongodb:27017/tripma` | Database connection |
| `FRONTEND_PORT` | `4200` | Frontend exposed port |
| `BACKEND_PORT` | `3000` | Backend exposed port |
| `MONGODB_PORT` | `27017` | MongoDB exposed port |
| `NODE_ENV` | `production` | Node environment |

---

## Health Checks

### Frontend
- **Check**: HTTP GET to `/` returns 200
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

### Backend
- **Check**: HTTP GET to `/api/health` returns 200
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

### MongoDB
- **Check**: `mongosh --eval "db.adminCommand('ping')"`
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

---

## Startup Order

1. **MongoDB** starts first (no dependencies)
2. **Backend** waits for MongoDB to be healthy
3. **Frontend** can start independently (static files)

Docker Compose `depends_on` with `condition: service_healthy` ensures proper ordering.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| MongoDB not ready when backend starts | Health check + depends_on condition |
| Port conflicts | Configurable ports via .env |
| Large image sizes | Multi-stage builds, .dockerignore |
| Slow builds | Layer caching, npm ci instead of install |

---

## Testing Checklist

- [ ] `docker-compose up` starts all services
- [ ] Frontend accessible at http://localhost:4200
- [ ] Backend accessible at http://localhost:3000
- [ ] MongoDB accessible at localhost:27017
- [ ] Frontend can call backend API
- [ ] Backend can connect to MongoDB
- [ ] Data persists after `docker-compose restart`
- [ ] Clean start with `docker-compose down -v && up`
- [ ] `docker-compose logs` shows healthy services
