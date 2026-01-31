// Admin Dashboard - 012-admin-panel

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { PlatformStats } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  stats = signal<PlatformStats | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadStats();
  }

  async loadStats(): Promise<void> {
    this.isLoading.set(true);
    const stats = await this.adminService.getStats('month');
    this.stats.set(stats);
    this.isLoading.set(false);
  }

  formatCurrency(cents: number): string {
    return `€${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
