// Admin Panel Routes - 012-admin-panel

import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin').then(m => m.AdminPanel),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.AdminDashboard),
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users-list/users-list').then(m => m.UsersList)
      },
      {
        path: 'airlines',
        loadComponent: () => import('./airlines/airlines-list/airlines-list').then(m => m.AirlinesList)
      },
      {
        path: 'airlines/:id',
        loadComponent: () => import('./airlines/airline-detail/airline-detail').then(m => m.AirlineDetail)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./bookings/bookings-list/bookings-list').then(m => m.BookingsList)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./statistics/statistics').then(m => m.Statistics)
      }
    ]
  }
];

// Navigation items for sidebar
export const ADMIN_NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '' },
  { path: '/admin/users', label: 'Users', icon: '' },
  { path: '/admin/airlines', label: 'Airlines', icon: '' },
  { path: '/admin/bookings', label: 'Bookings', icon: '' },
  { path: '/admin/statistics', label: 'Statistics', icon: '' }
];
