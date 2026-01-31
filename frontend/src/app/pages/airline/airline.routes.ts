// Airline Dashboard Routes - 011-airline-dashboard

import { Routes } from '@angular/router';
import { AirlineDashboard } from './airline';

export const AIRLINE_ROUTES: Routes = [
  {
    path: '',
    component: AirlineDashboard,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./overview/overview').then(m => m.Overview)
      },
      {
        path: 'routes',
        loadComponent: () => import('./routes/routes-list/routes-list').then(m => m.RoutesList)
      },
      {
        path: 'routes/new',
        loadComponent: () => import('./routes/route-form/route-form').then(m => m.RouteForm)
      },
      {
        path: 'routes/:id/edit',
        loadComponent: () => import('./routes/route-form/route-form').then(m => m.RouteForm)
      },
      {
        path: 'aircraft',
        loadComponent: () => import('./aircraft/aircraft-list/aircraft-list').then(m => m.AircraftList)
      },
      {
        path: 'aircraft/new',
        loadComponent: () => import('./aircraft/aircraft-form/aircraft-form').then(m => m.AircraftForm)
      },
      {
        path: 'aircraft/:id/edit',
        loadComponent: () => import('./aircraft/aircraft-form/aircraft-form').then(m => m.AircraftForm)
      },
      {
        path: 'flights',
        loadComponent: () => import('./flights/flights-list/flights-list').then(m => m.FlightsList)
      },
      {
        path: 'flights/new',
        loadComponent: () => import('./flights/flight-form/flight-form').then(m => m.FlightForm)
      },
      {
        path: 'flights/:id/edit',
        loadComponent: () => import('./flights/flight-form/flight-form').then(m => m.FlightForm)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pricing/pricing-list/pricing-list').then(m => m.PricingList)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./statistics/statistics').then(m => m.Statistics)
      }
    ]
  }
];
