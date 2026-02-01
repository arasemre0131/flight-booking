# Data Model: Backend Authentication & User Management

**Feature**: 014-backend-auth (BE-001)
**Date**: 2026-02-01

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          User                                │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                          │
│ email: String (unique, indexed)                             │
│ password: String (hashed, select: false)                    │
│ firstName: String                                           │
│ lastName: String                                            │
│ role: Enum ['passenger', 'airline', 'admin']                │
│ airlineId: ObjectId (FK → Airline, nullable)                │
│ mustChangePassword: Boolean                                 │
│ status: Enum ['active', 'inactive']                         │
│ createdAt: Date (auto)                                      │
│ updatedAt: Date (auto)                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:1 (when role='airline')
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Airline                              │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                          │
│ name: String                                                │
│ code: String (unique, e.g., "HA", "UA")                     │
│ status: Enum ['active', 'suspended']                        │
│ createdAt: Date (auto)                                      │
│ updatedAt: Date (auto)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## User Entity

### Schema Definition

```typescript
interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'passenger' | 'airline' | 'admin';
  airlineId?: Types.ObjectId;
  mustChangePassword: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Field Specifications

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| email | String | Yes | - | Valid email format, unique, lowercase |
| password | String | Yes | - | Min 8 characters (pre-hash) |
| firstName | String | Yes | - | Non-empty, trimmed |
| lastName | String | Yes | - | Non-empty, trimmed |
| role | Enum | Yes | 'passenger' | One of: passenger, airline, admin |
| airlineId | ObjectId | No | null | Required if role='airline' |
| mustChangePassword | Boolean | Yes | false | - |
| status | Enum | Yes | 'active' | One of: active, inactive |

### Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| email_unique | email | Unique | Fast lookup, prevent duplicates |
| role_status | role, status | Compound | User listing queries |
| airline_ref | airlineId | Single | Airline user lookup |

### Business Rules

1. **Email uniqueness**: No two users can have the same email
2. **Password visibility**: Password field never returned in queries (select: false)
3. **Airline linkage**: Users with role='airline' MUST have airlineId
4. **Admin protection**: Admin users cannot be deleted via API
5. **Status transitions**: Only admin can change user status

---

## Airline Entity

### Schema Definition

```typescript
interface IAirline {
  _id: Types.ObjectId;
  name: string;
  code: string;
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}
```

### Field Specifications

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| name | String | Yes | - | Non-empty, company name |
| code | String | Yes | - | 2-3 uppercase letters, unique |
| status | Enum | Yes | 'active' | One of: active, suspended |

### Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| code_unique | code | Unique | Fast lookup, prevent duplicates |

### Business Rules

1. **Code format**: Airline code must be 2-3 uppercase letters (e.g., "HA", "UAL")
2. **Cascade behavior**: Suspending airline suspends all linked users
3. **Creation**: Airlines are created during the invitation process

---

## State Transitions

### User Status

```
                  ┌──────────┐
     create ──────►  active  │
                  └────┬─────┘
                       │ admin deactivates
                       ▼
                  ┌──────────┐
                  │ inactive │
                  └────┬─────┘
                       │ admin reactivates
                       ▼
                  ┌──────────┐
                  │  active  │
                  └──────────┘
```

### mustChangePassword Flag

```
                  ┌───────────────┐
   invite airline │ mustChange=   │
   ───────────────► true          │
                  └───────┬───────┘
                          │ user changes password
                          ▼
                  ┌───────────────┐
                  │ mustChange=   │
                  │ false         │
                  └───────────────┘
```

---

## Validation Rules Summary

### Registration (Passenger)

```typescript
{
  email: required, valid email format, unique
  password: required, min 8 characters
  firstName: required, non-empty
  lastName: required, non-empty
}
```

### Login (All Roles)

```typescript
{
  email: required, valid email format
  password: required
}
```

### Invite Airline (Admin Only)

```typescript
{
  email: required, valid email format, unique
  companyName: required, non-empty
  airlineCode: required, 2-3 uppercase letters, unique
}
```

### Change Password

```typescript
{
  currentPassword: required (unless mustChangePassword=true)
  newPassword: required, min 8 characters, different from current
}
```

---

## Seed Data

### Default Admin

Created on first server startup if no admin exists:

```typescript
{
  email: 'admin@skyroute.com',
  password: '<bcrypt hash of "admin123">',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  mustChangePassword: false,
  status: 'active'
}
```
