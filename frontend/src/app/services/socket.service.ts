import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

export interface SeatUpdate {
  flightId: string;
  seats: string[];
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private currentFlightId: string | null = null;

  // Signal for seat updates
  readonly seatUpdates = signal<SeatUpdate | null>(null);

  connect(): void {
    if (this.socket?.connected) return;

    const wsUrl = environment.apiUrl.replace('/api', '');
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      // Rejoin flight room if we were watching one
      if (this.currentFlightId) {
        this.joinFlight(this.currentFlightId);
      }
    });

    this.socket.on('seatsBooked', (data: SeatUpdate) => {
      console.log('Seats booked:', data);
      this.seatUpdates.set(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  joinFlight(flightId: string): void {
    this.currentFlightId = flightId;
    if (this.socket?.connected) {
      this.socket.emit('joinFlight', flightId);
    }
  }

  leaveFlight(flightId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leaveFlight', flightId);
    }
    if (this.currentFlightId === flightId) {
      this.currentFlightId = null;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentFlightId = null;
  }
}
