// Statistics Page - 011-airline-dashboard

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AirlineService } from '../../../services/airline.service';
import { AirlineStats, DateRange } from '../../../models/airline-stats.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss'
})
export class Statistics implements OnInit {
  private airlineService = inject(AirlineService);

  stats = signal<AirlineStats | null>(null);
  isLoading = signal(true);

  // Date range
  dateRangeOption = signal<'week' | 'month' | 'year' | 'custom'>('month');
  customStart = signal<string>('');
  customEnd = signal<string>('');

  // Chart configurations
  barChartData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });
  lineChartData = signal<ChartData<'line'>>({ labels: [], datasets: [] });
  pieChartData = signal<ChartData<'pie'>>({ labels: [], datasets: [] });

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Top Routes by Passengers' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Revenue Trend' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Flight Status Distribution' }
    }
  };

  async ngOnInit(): Promise<void> {
    await this.loadStatistics();
  }

  async loadStatistics(): Promise<void> {
    this.isLoading.set(true);

    const dateRange = this.getDateRange();

    try {
      const result = await this.airlineService.getStatistics(dateRange);
      this.stats.set(result);
      this.updateCharts(result);
    } finally {
      this.isLoading.set(false);
    }
  }

  private getDateRange(): DateRange {
    const now = new Date();
    let start: Date;
    let end = now;

    switch (this.dateRangeOption()) {
      case 'week':
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start = new Date(now);
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'custom':
        start = new Date(this.customStart() || now);
        end = new Date(this.customEnd() || now);
        break;
      default:
        start = new Date(now);
        start.setMonth(start.getMonth() - 1);
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  private updateCharts(stats: AirlineStats): void {
    // Bar chart - Top routes
    this.barChartData.set({
      labels: stats.topRoutes.map(r => `${r.origin}→${r.destination}`),
      datasets: [{
        data: stats.topRoutes.map(r => r.passengerCount),
        backgroundColor: '#605dec',
        borderRadius: 4
      }]
    });

    // Line chart - Revenue trend
    this.lineChartData.set({
      labels: stats.revenueByDay.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        data: stats.revenueByDay.map(d => d.revenue / 100),
        borderColor: '#605dec',
        backgroundColor: 'rgba(96, 93, 236, 0.1)',
        fill: true,
        tension: 0.3
      }]
    });

    // Pie chart - Flight status
    this.pieChartData.set({
      labels: ['Scheduled', 'Completed', 'Cancelled'],
      datasets: [{
        data: [
          stats.flightsByStatus.scheduled,
          stats.flightsByStatus.completed,
          stats.flightsByStatus.cancelled
        ],
        backgroundColor: ['#1565c0', '#1e7e34', '#c62828']
      }]
    });
  }

  async onDateRangeChange(): Promise<void> {
    if (this.dateRangeOption() !== 'custom') {
      await this.loadStatistics();
    }
  }

  async applyCustomRange(): Promise<void> {
    if (this.customStart() && this.customEnd()) {
      await this.loadStatistics();
    }
  }

  formatCurrency(cents: number): string {
    return `€${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  }

  exportCSV(): void {
    const stats = this.stats();
    if (!stats) return;

    const dateRange = this.getDateRange();
    const rows: string[] = [];

    // Header
    rows.push('Airline Statistics Report');
    rows.push(`Period: ${dateRange.start} to ${dateRange.end}`);
    rows.push('');

    // Summary
    rows.push('Summary');
    rows.push(`Total Flights,${stats.summary.totalFlights}`);
    rows.push(`Total Passengers,${stats.summary.totalPassengers}`);
    rows.push(`Total Revenue,€${(stats.summary.totalRevenue / 100).toFixed(2)}`);
    rows.push(`Average Load Factor,${stats.summary.averageLoadFactor}%`);
    rows.push('');

    // Top Routes
    rows.push('Top Routes');
    rows.push('Route,Passengers');
    stats.topRoutes.forEach(r => {
      rows.push(`${r.origin} → ${r.destination},${r.passengerCount}`);
    });
    rows.push('');

    // Revenue by Day
    rows.push('Daily Revenue');
    rows.push('Date,Revenue');
    stats.revenueByDay.forEach(d => {
      rows.push(`${d.date},€${(d.revenue / 100).toFixed(2)}`);
    });

    // Create and download
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airline-stats-${dateRange.start}-${dateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
