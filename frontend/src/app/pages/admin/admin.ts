// Admin Panel Container - 012-admin-panel

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../../components/admin/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../components/admin/admin-header/admin-header';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebar, AdminHeader],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminPanel {}
