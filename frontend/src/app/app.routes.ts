import { Routes } from '@angular/router';

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
    path: '**',
    redirectTo: ''
  }
];
