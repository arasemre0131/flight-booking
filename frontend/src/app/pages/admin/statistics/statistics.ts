// Statistics Page - 012-admin-panel

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { StatsCard } from '../../../components/admin/stats-card/stats-card';
import { PlatformStats, AirlineSummary } from '../../../models/admin.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsCard],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss'
})
export class Statistics implements OnInit {
  private adminService = inject(AdminService);

  // State
  stats = signal<PlatformStats | null>(null);
  topAirlines = signal<AirlineSummary[]>([]);
  isLoading = signal(true);

  // Date range filter
  dateRange = signal<'week' | 'month' | 'year' | 'all'>('month');

  ngOnInit(): void {
    this.loadStats();
  }

  async loadStats(): Promise<void> {
    this.isLoading.set(true);

    const stats = await this.adminService.getStats(this.dateRange());
    this.stats.set(stats);

    // Get top airlines
    const airlines = this.adminService.getAllAirlines();
    const sorted = [...airlines].sort((a, b) => b.totalBookings - a.totalBookings);
    this.topAirlines.set(sorted.slice(0, 5));

    this.isLoading.set(false);
  }

  onDateRangeChange(): void {
    this.loadStats();
  }

  exportCsv(): void {
    this.adminService.exportStatsCsv(this.dateRange());
  }

  // Chart data for simple visualization
  getBookingChartData(): { label: string; value: number }[] {
    if (!this.stats()) return [];

    // Simple mock monthly data
    return [
      { label: 'Week 1', value: Math.floor(this.stats()!.totalBookings * 0.2) },
      { label: 'Week 2', value: Math.floor(this.stats()!.totalBookings * 0.25) },
      { label: 'Week 3', value: Math.floor(this.stats()!.totalBookings * 0.3) },
      { label: 'Week 4', value: Math.floor(this.stats()!.totalBookings * 0.25) }
    ];
  }

  getMaxBookingValue(): number {
    const data = this.getBookingChartData();
    return Math.max(...data.map(d => d.value), 1);
  }

  getUserGrowthData(): { label: string; passengers: number; airlines: number; admins: number }[] {
    if (!this.stats()) return [];

    const stats = this.stats()!;
    // Simple mock growth data
    return [
      { label: 'Jan', passengers: Math.floor(stats.usersByRole.passenger * 0.7), airlines: Math.floor(stats.usersByRole.airline * 0.8), admins: stats.usersByRole.admin },
      { label: 'Feb', passengers: Math.floor(stats.usersByRole.passenger * 0.85), airlines: Math.floor(stats.usersByRole.airline * 0.9), admins: stats.usersByRole.admin },
      { label: 'Mar', passengers: stats.usersByRole.passenger, airlines: stats.usersByRole.airline, admins: stats.usersByRole.admin }
    ];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
