// Admin Sidebar Component - 012-admin-panel

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ADMIN_NAV_ITEMS } from '../../../pages/admin/admin.routes';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss'
})
export class AdminSidebar {
  navItems = ADMIN_NAV_ITEMS;
}
