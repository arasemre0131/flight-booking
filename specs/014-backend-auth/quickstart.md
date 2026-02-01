# Quickstart: Backend Auth Test Scenarios

## Test 1: Admin Login
```bash
# Default admin after first startup
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skyroute.com","password":"admin123"}'
```

## Test 2: Passenger Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","firstName":"Test","lastName":"User"}'
```

## Test 3: Invite Airline (Admin)
```bash
curl -X POST http://localhost:3000/api/admin/invite-airline \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"email":"airline@test.com","companyName":"Test Airlines","airlineCode":"TA"}'
```

## Test 4: Protected Endpoint
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```
