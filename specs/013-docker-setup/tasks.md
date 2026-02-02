# Tasks: 013-docker-setup

**Feature**: Docker Infrastructure Setup
**Created**: 2026-02-01
**Total Tasks**: 25

---

## Phase 1: Setup (Core Docker Files)

- [x] T001 Create docker-compose.yml with 3 services (frontend, backend, mongodb) in /docker-compose.yml
- [x] T002 [P] Create .env.example with all environment variables in /.env.example
- [x] T003 [P] Create root .dockerignore file in /.dockerignore

---

## Phase 2: Foundational (Backend Skeleton)

> Backend must exist before Docker can build it

- [x] T004 Create backend directory structure in /backend/
- [x] T005 Create backend package.json with Express dependencies in /backend/package.json
- [x] T006 Create backend tsconfig.json in /backend/tsconfig.json
- [x] T007 Create minimal Express server with /api/health endpoint in /backend/src/server.ts
- [x] T008 Create database connection config in /backend/src/config/database.ts
- [x] T009 Create app entry point in /backend/src/app.ts

---

## Phase 3: US1 - Developer Quick Start

> Goal: `docker-compose up` starts everything

- [x] T010 [US1] Create frontend Dockerfile with multi-stage build in /frontend/Dockerfile
- [x] T011 [US1] Create nginx.conf for SPA routing in /frontend/nginx.conf
- [x] T012 [P] [US1] Create frontend .dockerignore in /frontend/.dockerignore
- [x] T013 [US1] Create backend Dockerfile in /backend/Dockerfile
- [x] T014 [P] [US1] Create backend .dockerignore in /backend/.dockerignore
- [x] T015 [US1] Add health checks to docker-compose.yml
- [x] T016 [US1] Add depends_on with health conditions to docker-compose.yml

**Test Criteria**:
- `docker-compose up` starts all 3 containers
- Frontend accessible at http://localhost:4200
- Backend accessible at http://localhost:3000/api/health
- All containers show as healthy in `docker ps`

---

## Phase 4: US2 - Component Isolation

> Goal: Each component runs independently

- [x] T017 [US2] Configure Docker network in docker-compose.yml
- [x] T018 [US2] Verify container isolation (stop one, others continue)

**Test Criteria**:
- `docker-compose stop backend` doesn't crash frontend/mongodb
- `docker-compose stop frontend` doesn't crash backend/mongodb
- Containers can communicate via service names

---

## Phase 5: US3 - Data Persistence

> Goal: MongoDB data survives restarts

- [x] T019 [US3] Configure named volume for MongoDB in docker-compose.yml
- [x] T020 [US3] Test data persistence after restart

**Test Criteria**:
- Create data in MongoDB
- Run `docker-compose restart`
- Verify data still exists
- Run `docker-compose down -v && docker-compose up`
- Verify data is gone (fresh start)

---

## Phase 6: US4 - Environment Configuration

> Goal: Configure via .env file

- [x] T021 [US4] Update docker-compose.yml to use .env variables for ports
- [x] T022 [US4] Update backend to read MONGODB_URI from environment
- [x] T023 [US4] Document all environment variables in .env.example

**Test Criteria**:
- Change port in .env, restart, verify new port works
- Change MONGODB_URI, verify backend connects to correct database

---

## Phase 7: Polish & Verification

- [x] T024 Full integration test: docker-compose up from scratch
- [x] T025 Update README.txt with Docker run instructions

---

## Dependencies

```
T001 (docker-compose.yml)
  ├── T004-T009 (backend skeleton) - backend must exist to build
  │     └── T013-T014 (backend Dockerfile)
  ├── T010-T012 (frontend Dockerfile)
  └── T015-T016 (health checks)
        └── T017-T023 (US2-US4 features)
              └── T024-T025 (polish)
```

---

## Parallel Execution Opportunities

### Can run in parallel:
- T002, T003 (both independent config files)
- T012, T014 (.dockerignore files)
- T010-T012 (frontend Docker) || T013-T014 (backend Docker) after T009

---

## Implementation Strategy

### MVP (Minimum Viable):
- Phase 1-3 only (T001-T016)
- Basic `docker-compose up` works
- All 3 containers start and communicate

### Full Implementation:
- All phases (T001-T025)
- Full configuration, persistence, and documentation

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | T001-T003 | Core Docker files |
| 2 | T004-T009 | Backend skeleton |
| 3 | T010-T016 | US1: Quick Start |
| 4 | T017-T018 | US2: Isolation |
| 5 | T019-T020 | US3: Persistence |
| 6 | T021-T023 | US4: Configuration |
| 7 | T024-T025 | Polish |

**Total**: 25 tasks
**Parallel opportunities**: 4 groups identified
**MVP scope**: T001-T016 (16 tasks)
