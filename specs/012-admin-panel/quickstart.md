# Quickstart: 012-admin-panel

**Date**: 2025-01-31
**Feature**: Admin Panel

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+
- Completed features: 010-auth, 011-airline-dashboard

## Quick Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already)
npm install

# Start development server
ng serve
```

## Access Admin Panel

1. Open browser to `http://localhost:4200`
2. Login with admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Navigate to `/admin`

## File Structure Overview

```
frontend/src/app/
├── guards/
│   └── admin.guard.ts          # Route protection
├── models/
│   └── admin.model.ts          # Admin-specific types
├── services/
│   └── admin.service.ts        # Data management
├── mock-data/
│   └── admin.data.ts           # Extended mock data
├── components/admin/
│   ├── admin-sidebar/          # Navigation sidebar
│   ├── admin-header/           # Header with user info
│   ├── stats-card/             # Metric display card
│   ├── data-table/             # Reusable table component
│   └── confirmation-modal/     # Action confirmation
└── pages/admin/
    ├── admin.ts                # Container component
    ├── admin.routes.ts         # Route definitions
    ├── dashboard/              # Overview page
    ├── users/                  # User management
    │   ├── users-list/
    │   ├── user-form/
    │   └── user-detail/
    ├── airlines/               # Airline management
    │   ├── airlines-list/
    │   └── airline-detail/
    ├── bookings/               # Booking overview
    │   ├── bookings-list/
    │   └── booking-detail/
    └── statistics/             # Platform statistics
```

## Key Components

### 1. Admin Guard
Protects `/admin/*` routes. Redirects non-admins to home.

### 2. Admin Service
Central state management using Angular signals:
- `users` - All platform users
- `airlines` - Airline summaries
- `bookings` - Booking summaries
- `stats` - Platform statistics

### 3. Data Table Component
Reusable table with:
- Sortable columns (date, name, status, amount)
- Server-side pagination (25 items/page)
- Empty state messages

### 4. Confirmation Modal
Reusable for destructive actions:
- Role changes
- User deactivation
- Airline suspension

## Testing the Feature

### User Management Flow
1. Go to `/admin/users`
2. Filter by role (dropdown)
3. Search by email
4. Click user row → view details
5. Edit user → save changes
6. Change role → confirm dialog
7. Deactivate → confirm dialog

### Booking Search Flow
1. Go to `/admin/bookings`
2. Set date range filter
3. Filter by airline
4. Search by confirmation code
5. Click booking → view details

### Statistics Flow
1. Go to `/admin/statistics`
2. View default metrics
3. Change date range
4. Export to CSV

## Common Patterns

### Pagination
```typescript
// In component
page = signal(1);
pageSize = signal(25);

loadPage(newPage: number) {
  this.page.set(newPage);
  this.adminService.getUsers(this.filters(), {
    page: newPage,
    pageSize: this.pageSize()
  });
}
```

### Confirmation Dialog
```typescript
// Show confirmation
showConfirm = signal(false);
confirmAction = signal<() => void>(() => {});

confirmDeactivate(userId: string) {
  this.confirmAction.set(() => this.adminService.deactivateUser(userId));
  this.showConfirm.set(true);
}

onConfirmed() {
  this.confirmAction()();
  this.showConfirm.set(false);
}
```

### Date Range Filter
```typescript
dateRange = signal<DateRange>({
  from: this.getDefaultStart(),
  to: new Date().toISOString()
});

applyDateRange() {
  this.adminService.getStats(this.dateRange());
}
```

## Troubleshooting

### "Access Denied" on /admin
- Verify logged in as admin (role: 'admin')
- Check localStorage for session

### Statistics not loading
- Verify mock data in admin.data.ts
- Check browser console for errors

### Table not paginating
- Verify pageSize is 25
- Check pagination component bindings
