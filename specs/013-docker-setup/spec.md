# Feature Specification: Docker Infrastructure Setup

**Feature ID**: 013-docker-setup
**Created**: 2026-02-01
**Status**: Draft

---

## Overview

Enable the flight booking application to run in a containerized environment where each component (frontend, backend, database) operates in its own isolated container, orchestrated together for seamless deployment and testing.

---

## Problem Statement

Currently, the application requires manual setup of each component separately. Developers and examiners need a simple, single-command way to start the entire application stack. The exam requirement mandates that each component runs in a separate Docker container.

---

## User Stories

### US1: Developer Quick Start
**As a** developer or examiner
**I want to** start the entire application with a single command
**So that** I can quickly run and test the application without manual configuration

**Acceptance Criteria**:
- Running `docker-compose up` starts all three components
- Application is accessible within 2 minutes of command execution
- No manual configuration required after initial setup

### US2: Component Isolation
**As a** system administrator
**I want** each component to run in its own container
**So that** they can be scaled, updated, and managed independently

**Acceptance Criteria**:
- Frontend runs in a dedicated container
- Backend runs in a dedicated container
- Database runs in a dedicated container
- Containers can communicate with each other
- Stopping one container doesn't crash others

### US3: Data Persistence
**As a** developer
**I want** database data to persist between container restarts
**So that** I don't lose test data when restarting the application

**Acceptance Criteria**:
- Database data survives container restart
- Data can be reset by removing a specific volume
- Fresh start possible with `docker-compose down -v`

### US4: Environment Configuration
**As a** developer
**I want** to configure the application via environment variables
**So that** I can easily switch between different configurations

**Acceptance Criteria**:
- Database connection string is configurable
- Port numbers are configurable
- Example environment file is provided

---

## Functional Requirements

### FR-001: Docker Compose Orchestration
The system shall provide a docker-compose configuration that:
- Defines three separate services (frontend, backend, database)
- Establishes network connectivity between services
- Starts all services with a single command

### FR-002: Frontend Container
The frontend container shall:
- Serve the built Angular application
- Be accessible on port 4200 (configurable)
- Handle client-side routing properly

### FR-003: Backend Container
The backend container shall:
- Run the Node.js/Express application
- Be accessible on port 3000 (configurable)
- Connect to the database container
- Wait for database to be ready before starting

### FR-004: Database Container
The database container shall:
- Run MongoDB
- Be accessible on port 27017 (configurable)
- Store data in a persistent volume
- Initialize with required collections on first run

### FR-005: Health Checks
The system shall:
- Verify each container is running and healthy
- Restart unhealthy containers automatically
- Log container status for debugging

### FR-006: Environment Configuration
The system shall:
- Read configuration from environment variables
- Provide an example .env file with all required variables
- Use sensible defaults when variables are not set

---

## Non-Functional Requirements

### NFR-001: Startup Time
All containers shall be running and accessible within 2 minutes of `docker-compose up`.

### NFR-002: Resource Usage
The complete stack shall run on a machine with:
- 4GB RAM minimum
- 10GB disk space minimum

### NFR-003: Compatibility
The configuration shall work with:
- Docker Engine 20.10+
- Docker Compose V2+

---

## Success Criteria

| Criteria | Target | Measurement |
|----------|--------|-------------|
| Single command startup | `docker-compose up` starts everything | Manual verification |
| Startup time | < 2 minutes | Timer from command to accessible |
| All services accessible | 3/3 containers running | `docker ps` shows 3 healthy containers |
| Data persistence | Data survives restart | Create data, restart, verify data exists |
| Fresh start capability | Clean slate possible | `docker-compose down -v && up` starts fresh |

---

## Out of Scope

- Kubernetes deployment
- Cloud-specific configurations (AWS, GCP, Azure)
- CI/CD pipeline integration
- SSL/TLS certificate configuration
- Load balancing
- Container registry publishing

---

## Dependencies

- Completed frontend application (specs 001-012)
- Backend application (to be developed)
- Docker and Docker Compose installed on host machine

---

## Assumptions

1. Docker and Docker Compose are pre-installed on the target machine
2. Ports 4200, 3000, and 27017 are available on the host
3. Internet access is available for pulling base images
4. The backend will use MongoDB as the database (per exam requirements)
5. No production-grade security is required (this is for exam/development)

---

## Files to Create

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates all 3 containers |
| `frontend/Dockerfile` | Builds and serves Angular app |
| `backend/Dockerfile` | Runs Node.js Express server |
| `.env.example` | Example environment variables |
| `.dockerignore` | Files to exclude from build context |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Port conflicts on host | Medium | Medium | Document required ports, make configurable |
| Slow image pulls | Low | Low | Use common base images, document expected time |
| Database connection timing | Medium | High | Implement health checks and retry logic |
