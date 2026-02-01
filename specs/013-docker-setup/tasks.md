# Tasks: Docker Infrastructure Setup

**Feature**: 013-docker-setup
**Created**: 2026-02-01

---

## Phase 1: Setup

- [ ] T001 Create docker-compose.yml with 3 services in /docker-compose.yml
- [ ] T002 Create .env.example with environment variables in /.env.example
- [ ] T003 Create root .dockerignore in /.dockerignore

---

## Phase 2: Frontend Container

- [ ] T004 Create frontend Dockerfile with multi-stage build in /frontend/Dockerfile
- [ ] T005 Create nginx.conf for SPA routing in /frontend/nginx.conf
- [ ] T006 Create frontend .dockerignore in /frontend/.dockerignore

---

## Phase 3: Backend Container

- [ ] T007 Create backend directory structure in /backend/
- [ ] T008 Create backend package.json in /backend/package.json
- [ ] T009 Create backend tsconfig.json in /backend/tsconfig.json
- [ ] T010 Create backend Dockerfile in /backend/Dockerfile
- [ ] T011 Create backend .dockerignore in /backend/.dockerignore
- [ ] T012 Create minimal Express server with health endpoint in /backend/src/server.ts
- [ ] T013 Create database connection module in /backend/src/config/database.ts

---

## Phase 4: Integration

- [ ] T014 Update frontend environment to use backend URL
- [ ] T015 Add health check endpoints to docker-compose.yml
- [ ] T016 Configure depends_on with health conditions

---

## Phase 5: Verification

- [ ] T017 Test docker-compose up starts all services
- [ ] T018 Test frontend accessible at localhost:4200
- [ ] T019 Test backend accessible at localhost:3000/api/health
- [ ] T020 Test MongoDB connection from backend
- [ ] T021 Test data persistence after restart
- [ ] T022 Test clean start with docker-compose down -v

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | T001-T003 | Core Docker setup |
| 2 | T004-T006 | Frontend containerization |
| 3 | T007-T013 | Backend setup & containerization |
| 4 | T014-T016 | Service integration |
| 5 | T017-T022 | Testing & verification |

**Total**: 22 tasks
