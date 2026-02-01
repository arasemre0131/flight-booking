# Research: Docker Infrastructure Setup

**Feature**: 013-docker-setup
**Date**: 2026-02-01

---

## Decision 1: Frontend Serving Strategy

**Decision**: Multi-stage build with Nginx

**Rationale**:
- Angular apps are static files after build
- Nginx is lightweight and optimized for static serving
- Multi-stage keeps final image small (~25MB vs ~1GB with Node)
- Nginx handles SPA routing with try_files

**Alternatives Considered**:
- Node.js http-server: Heavier, slower for static files
- Apache: More complex configuration
- Node.js Express static: Overkill for static files

---

## Decision 2: Base Images

**Decision**:
- Frontend build: `node:20-alpine`
- Frontend serve: `nginx:alpine`
- Backend: `node:20-alpine`
- Database: `mongo:7.0`

**Rationale**:
- Alpine images are smallest (~50MB vs ~900MB)
- Node 20 is LTS with best performance
- MongoDB 7.0 is latest stable with best features

**Alternatives Considered**:
- Debian-based images: Larger, more packages
- Node 18: Works but 20 has better performance
- MongoDB 6.0: Works but 7.0 has improvements

---

## Decision 3: Network Configuration

**Decision**: Bridge network with service discovery

**Rationale**:
- Services can reach each other by name (e.g., `mongodb`, `backend`)
- Isolated from host network
- Simple configuration

**Alternatives Considered**:
- Host network: Less isolation, port conflicts possible
- Overlay network: Overkill for single-host deployment

---

## Decision 4: Volume Strategy

**Decision**: Named volume for MongoDB data only

**Rationale**:
- Only database needs persistence
- Frontend/backend are stateless
- Named volumes are easier to manage than bind mounts

**Alternatives Considered**:
- Bind mounts: Good for development, not for exam submission
- Anonymous volumes: Hard to manage/clean

---

## Decision 5: Health Check Strategy

**Decision**: HTTP health endpoints + MongoDB ping

**Rationale**:
- Simple and reliable
- Works with Docker Compose depends_on
- Easy to debug

**Alternatives Considered**:
- TCP checks only: Doesn't verify app is actually working
- Complex liveness probes: Overkill for this use case

---

## Decision 6: Nginx SPA Configuration

**Decision**: Use try_files to redirect all routes to index.html

**Rationale**:
- Angular handles client-side routing
- 404s for missing files go to Angular router
- Simple, proven pattern

**Configuration**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Best Practices Applied

1. **Multi-stage builds** - Smaller images, faster deploys
2. **Non-root users** - Security best practice
3. **Health checks** - Reliable startup ordering
4. **.dockerignore** - Faster builds, smaller context
5. **Environment variables** - Configuration flexibility
6. **Named volumes** - Persistent, manageable data
7. **Alpine images** - Minimal attack surface
