/**
 * Admin Routes Contract
 * 012-admin-panel
 *
 * Defines the routing structure for the admin panel.
 */

// ============================================================================
// Route Structure
// ============================================================================

/**
 * /admin                     → AdminDashboard (dashboard component)
 * /admin/users               → UsersList
 * /admin/users/new           → UserForm (create)
 * /admin/users/:id           → UserDetail
 * /admin/users/:id/edit      → UserForm (edit)
 * /admin/airlines            → AirlinesList
 * /admin/airlines/:id        → AirlineDetail
 * /admin/bookings            → BookingsList
 * /admin/bookings/:id        → BookingDetail (modal or page)
 * /admin/statistics          → Statistics
 */

// ============================================================================
// Route Guards
// ============================================================================

/**
 * adminGuard: CanActivateFn
 *
 * Checks:
 * 1. User is authenticated (AuthService.isAuthenticated)
 * 2. User has 'admin' role (AuthService.currentUser().role === 'admin')
 *
 * Redirects to '/' if either check fails.
 */

// ============================================================================
// Route Configuration
// ============================================================================

export const ADMIN_ROUTES_CONFIG = {
  path: 'admin',
  component: 'AdminDashboard',
  canActivate: ['adminGuard'],
  children: [
    { path: '', component: 'Dashboard', pathMatch: 'full' },
    { path: 'users', component: 'UsersList' },
    { path: 'users/new', component: 'UserForm' },
    { path: 'users/:id', component: 'UserDetail' },
    { path: 'users/:id/edit', component: 'UserForm' },
    { path: 'airlines', component: 'AirlinesList' },
    { path: 'airlines/:id', component: 'AirlineDetail' },
    { path: 'bookings', component: 'BookingsList' },
    { path: 'bookings/:id', component: 'BookingDetail' },
    { path: 'statistics', component: 'Statistics' }
  ]
};

// ============================================================================
// Navigation Items (for sidebar)
// ============================================================================

export const ADMIN_NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/airlines', label: 'Airlines', icon: '✈️' },
  { path: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { path: '/admin/statistics', label: 'Statistics', icon: '📈' }
];
