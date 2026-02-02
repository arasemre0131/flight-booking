// Bookings List Page - 012-admin-panel

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { DataTable, TableColumn, SortEvent } from '../../../../components/admin/data-table/data-table';
import { BookingDetail } from '../booking-detail/booking-detail';
import { BookingSummary, BookingStatus, BookingFilters, PaginationParams } from '../../../../models/admin.model';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, BookingDetail],
  templateUrl: './bookings-list.html',
  styleUrl: './bookings-list.scss'
})
export class BookingsList implements OnInit {
  private adminService = inject(AdminService);

  // Table configuration
  columns: TableColumn[] = [
    { key: 'confirmationCode', label: 'Confirmation', sortable: true },
    { key: 'passengerName', label: 'Passenger', sortable: true },
    { key: 'airlineName', label: 'Airline', sortable: true },
    { key: 'route', label: 'Route' },
    { key: 'totalAmount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'createdAt', label: 'Booked', type: 'date', sortable: true }
  ];

  // State
  bookings = signal<BookingSummary[]>([]);
  isLoading = signal(false);
  totalBookings = signal(0);
  totalPages = signal(0);

  // Filters
  searchTerm = signal('');
  statusFilter = signal<BookingStatus | 'all'>('all');
  airlineFilter = signal<string>('all');
  dateRange = signal<'today' | 'week' | 'month' | 'all'>('all');

  // Pagination
  currentPage = signal(1);
  pageSize = 25;

  // Sort
  sortBy = signal<string | undefined>(undefined);
  sortOrder = signal<'asc' | 'desc'>('desc');

  // Airlines for filter
  airlines = signal<{ id: string; name: string }[]>([]);

  // Detail modal
  showDetail = signal(false);
  selectedBooking = signal<BookingSummary | null>(null);

  ngOnInit(): void {
    this.loadAirlines();
    this.loadBookings();
  }

  loadAirlines(): void {
    const airlines = this.adminService.getAllAirlines();
    this.airlines.set(airlines.map(a => ({ id: a.id, name: a.name })));
  }

  async loadBookings(): Promise<void> {
    this.isLoading.set(true);

    const filters: BookingFilters = {
      search: this.searchTerm() || undefined,
      status: this.statusFilter(),
      airlineId: this.airlineFilter() !== 'all' ? this.airlineFilter() : undefined,
      dateRange: this.dateRange()
    };

    const pagination: PaginationParams = {
      page: this.currentPage(),
      pageSize: this.pageSize,
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    };

    const result = await this.adminService.getBookings(filters, pagination);

    this.bookings.set(result.items);
    this.totalBookings.set(result.total);
    this.totalPages.set(result.totalPages);
    this.isLoading.set(false);
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadBookings();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadBookings();
  }

  onSort(event: SortEvent): void {
    this.sortBy.set(event.column);
    this.sortOrder.set(event.direction);
    this.loadBookings();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadBookings();
  }

  onRowClick(booking: BookingSummary): void {
    this.selectedBooking.set(booking);
    this.showDetail.set(true);
  }

  closeDetail(): void {
    this.showDetail.set(false);
    this.selectedBooking.set(null);
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
