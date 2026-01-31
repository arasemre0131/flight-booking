// Booking Detail Modal - 012-admin-panel

import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';
import { BookingSummary } from '../../../../models/admin.model';

interface BookingFullDetail extends BookingSummary {
  passengerEmail: string;
  passengerPhone?: string;
  seats: string[];
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  paymentMethod?: string;
  paymentLast4?: string;
}

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-detail.html',
  styleUrl: './booking-detail.scss'
})
export class BookingDetail implements OnInit {
  @Input() booking: BookingSummary | null = null;
  @Output() close = new EventEmitter<void>();

  private adminService = inject(AdminService);

  fullDetail = signal<BookingFullDetail | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    if (this.booking) {
      this.loadDetail(this.booking.id);
    }
  }

  async loadDetail(id: string): Promise<void> {
    this.isLoading.set(true);
    const detail = await this.adminService.getBookingById(id);
    this.fullDetail.set(detail as BookingFullDetail);
    this.isLoading.set(false);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed'
    };
    return classes[status] || '';
  }
}
