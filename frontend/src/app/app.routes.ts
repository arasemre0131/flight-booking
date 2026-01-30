import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
    // TODO: Replace with actual search results component when implemented
  },
  {
    path: '**',
    redirectTo: ''
  }
];
