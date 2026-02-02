// Airlines List Page - 012-admin-panel

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { DataTable, TableColumn, SortEvent } from '../../../../components/admin/data-table/data-table';
import { ConfirmationModal } from '../../../../components/admin/confirmation-modal/confirmation-modal';
import { AirlineSummary, AirlineStatus, PaginationParams, PaginatedResult } from '../../../../models/admin.model';

@Component({
  selector: 'app-airlines-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, ConfirmationModal],
  templateUrl: './airlines-list.html',
  styleUrl: './airlines-list.scss'
})
export class AirlinesList implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  // Table configuration
  columns: TableColumn[] = [
    { key: 'name', label: 'Airline', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'totalFlights', label: 'Flights', sortable: true },
    { key: 'totalBookings', label: 'Bookings', sortable: true },
    { key: 'activeOperators', label: 'Operators', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true }
  ];

  // State
  airlines = signal<AirlineSummary[]>([]);
  isLoading = signal(false);
  totalAirlines = signal(0);
  totalPages = signal(0);

  // Filters
  searchTerm = signal('');
  statusFilter = signal<AirlineStatus | 'all'>('all');

  // Pagination
  currentPage = signal(1);
  pageSize = 25;

  // Sort
  sortBy = signal<string | undefined>(undefined);
  sortOrder = signal<'asc' | 'desc'>('asc');

  // Modals
  showSuspendConfirm = signal(false);
  suspendAirline = signal<AirlineSummary | null>(null);

  ngOnInit(): void {
    this.loadAirlines();
  }

  async loadAirlines(): Promise<void> {
    this.isLoading.set(true);

    const pagination: PaginationParams = {
      page: this.currentPage(),
      pageSize: this.pageSize,
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    };

    // Fetch airlines from API
    const result = await this.adminService.getAirlines(pagination);
    let filtered = [...result.items];

    // Apply search filter
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(term) ||
        a.code.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter(a => a.status === this.statusFilter());
    }

    // Apply sorting
    if (this.sortBy()) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[this.sortBy()!];
        const bVal = (b as any)[this.sortBy()!];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return this.sortOrder() === 'asc' ? cmp : -cmp;
      });
    }

    this.airlines.set(filtered);
    this.totalAirlines.set(result.total);
    this.totalPages.set(result.totalPages);
    this.isLoading.set(false);
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadAirlines();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadAirlines();
  }

  onSort(event: SortEvent): void {
    this.sortBy.set(event.column);
    this.sortOrder.set(event.direction);
    this.loadAirlines();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadAirlines();
  }

  onRowClick(airline: AirlineSummary): void {
    this.router.navigate(['/admin/airlines', airline.id]);
  }

  // Suspend/Resume
  openSuspendConfirm(airline: AirlineSummary, event: Event): void {
    event.stopPropagation();
    this.suspendAirline.set(airline);
    this.showSuspendConfirm.set(true);
  }

  async confirmSuspend(): Promise<void> {
    const airline = this.suspendAirline();
    if (!airline) return;

    if (airline.status === 'active') {
      await this.adminService.suspendAirline(airline.id);
    } else {
      await this.adminService.resumeAirline(airline.id);
    }

    this.showSuspendConfirm.set(false);
    this.suspendAirline.set(null);
    this.loadAirlines();
  }

  cancelSuspend(): void {
    this.showSuspendConfirm.set(false);
    this.suspendAirline.set(null);
  }

  getSuspendAction(): string {
    return this.suspendAirline()?.status === 'active' ? 'suspend' : 'resume';
  }

  // Pagination helpers
  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
