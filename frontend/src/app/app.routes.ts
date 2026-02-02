import { Routes } from '@angular/router';
import { airlineGuard } from './guards/airline.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search-results/search-results').then(m => m.SearchResults)
  },
  {
    path: 'passenger-info',
    loadComponent: () => import('./pages/passenger-info/passenger-info').then(m => m.PassengerInfo)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterPage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password').then(m => m.ChangePasswordPage)
  },
  {
    path: 'seat-selection',
    loadComponent: () => import('./pages/seat-selection/seat-selection').then(m => m.SeatSelection)
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment/payment').then(m => m.PaymentPage)
  },
  {
    path: 'confirmation',
    loadComponent: () => import('./pages/confirmation/confirmation').then(m => m.ConfirmationPage)
  },
  {
    path: 'airline',
    loadChildren: () => import('./pages/airline/airline.routes').then(m => m.AIRLINE_ROUTES),
    canActivate: [airlineGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
