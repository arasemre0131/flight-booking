import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface BookingResponse {
  _id: string;
  flightId: {
    _id: string;
    routeId: {
      flightNumber: string;
      originAirport: string;
      destinationAirport: string;
    };
    departureTime: string;
    arrivalTime: string;
  } | null;
  passengers: any[];
  status: string;
  totalPrice: number;
  ticketClass: string;
  createdAt: string;
}

interface Trip {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  passengerCount: number;
  status: string;
  totalPrice: number;
  ticketClass: string;
}

@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-trips.html',
  styleUrl: './my-trips.scss'
})
export class MyTripsPage implements OnInit {
  private authService = inject(AuthService);

  trips = signal<Trip[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTrips();
  }

  async loadTrips(): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load trips');
      }

      const data = await response.json();
      const bookings: BookingResponse[] = data.bookings || [];

      // Transform backend data to frontend format
      const trips: Trip[] = bookings.map(booking => ({
        id: booking._id,
        flightNumber: booking.flightId?.routeId?.flightNumber || 'N/A',
        origin: booking.flightId?.routeId?.originAirport || 'N/A',
        destination: booking.flightId?.routeId?.destinationAirport || 'N/A',
        departureTime: booking.flightId?.departureTime || booking.createdAt,
        passengerCount: booking.passengers?.length || 0,
        status: booking.status,
        totalPrice: booking.totalPrice,
        ticketClass: booking.ticketClass
      }));

      this.trips.set(trips);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}
