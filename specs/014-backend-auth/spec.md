# Feature Specification: Backend Authentication & User Management

**Feature ID**: 014-backend-auth (BE-001)
**Created**: 2026-02-01
**Status**: Draft

---

## Overview

Backend authentication for flight booking app. Three user roles: passenger (self-register), airline (admin invitation), admin (auto-created).

---

## User Types

| Role | Description | Registration |
|------|-------------|--------------|
| **Passenger** | Books flights | Self-registration |
| **Airline** | Manages routes/flights | Admin invitation |
| **Admin** | User management | Auto-created on first run |

---

## User Stories (PDF Requirements)

### US1: Passenger Registration
- User provides email, password, firstName, lastName
- Email must be unique
- Password min 8 characters
- Auto-login after registration

### US2: User Login
- Email + password
- Returns JWT token + user data
- Generic error on failure (no hints)
- Works for all roles

### US3: Admin Auto-Creation
- Created on first backend startup if no admin exists
- Default: admin@skyroute.com / admin123

### US4: Airline Invitation
- Admin provides: email, company name, airline code
- System creates airline user with temporary password
- Returns temp password to admin
- Airline marked as mustChangePassword=true

### US5: Password Change (First Login)
- Airline must change password before accessing features
- New password min 8 chars
- Clears mustChangePassword flag

### US6: User Deletion
- Admin can delete non-admin users
- Deleted user cannot login

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register passenger |
| POST | /api/auth/login | No | Login, returns token + user |
| POST | /api/auth/logout | Yes | Logout |
| PUT | /api/auth/change-password | Yes | Change password |
| GET | /api/admin/users | Admin | List users |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| POST | /api/admin/invite-airline | Admin | Invite airline |

---

## Data Model

### User
```
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  firstName: string,
  lastName: string,
  role: 'passenger' | 'airline' | 'admin',
  airlineId?: ObjectId,
  mustChangePassword: boolean,
  status: 'active' | 'inactive',
  createdAt: Date,
  updatedAt: Date
}
```

### Airline
```
{
  _id: ObjectId,
  name: string,
  code: string (unique, e.g. "HA"),
  status: 'active' | 'suspended',
  createdAt: Date
}
```

---

## Out of Scope

- Social login
- 2FA
- Password recovery
- Email verification
- Token refresh
- Rate limiting
