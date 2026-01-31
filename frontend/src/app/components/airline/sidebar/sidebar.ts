// Airline Sidebar Navigation - 011-airline-dashboard

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-airline-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class AirlineSidebar {
  navItems: NavItem[] = [
    { label: 'Overview', path: '/airline/overview', icon: '📊' },
    { label: 'Routes', path: '/airline/routes', icon: '🛫' },
    { label: 'Aircraft', path: '/airline/aircraft', icon: '✈️' },
    { label: 'Flights', path: '/airline/flights', icon: '📅' },
    { label: 'Pricing', path: '/airline/pricing', icon: '💰' },
    { label: 'Statistics', path: '/airline/statistics', icon: '📈' }
  ];
}
