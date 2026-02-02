import { Component, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeatMapComponent } from '../../components/seat-map/seat-map';
import { SeatLegend } from '../../components/seat-legend/seat-legend';
import { PassengerSeatList } from '../../components/passenger-seat-list/passenger-seat-list';
import { FlightSummary } from '../../components/flight-summary/flight-summary';
import { BookingService, SeatInfo } from '../../services/booking.service';
import { SocketService } from '../../services/socket.service';
import { MOCK_SEAT_MAP, getSeatById } from '../../mock-data/seat-map.data';
import { Seat, SeatAssignment, SeatMap, SeatType, SeatClass, calculateSeatFees } from '../../models/seat.model';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, SeatMapComponent, SeatLegend, PassengerSeatList, FlightSummary],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.scss'
})
export class SeatSelection implements OnInit, OnDestroy {
  private bookingService = inject(BookingService);
  private socketService = inject(SocketService);
  private router = inject(Router);

  constructor() {
    // Listen for real-time seat updates
    effect(() => {
      const update = this.socketService.seatUpdates();
      if (update) {
        this.markSeatsAsOccupied(update.seats);
      }
    });
  }

  // Seat map data
  seatMap = signal<SeatMap>(MOCK_SEAT_MAP);

  // Local copy of seat assignments for manipulation
  localAssignments = signal<SeatAssignment[]>([]);

  // Computed: Get booking data
  selectedFlight = this.bookingService.selectedFlight;
  returnFlight = this.bookingService.returnFlight;
  searchCriteria = this.bookingService.searchCriteria;
  passengers = this.bookingService.passengers;

  // Passengers count for flight summary
  passengersCount = computed(() => {
    const criteria = this.searchCriteria();
    return criteria ? criteria.passengers : { adults: 1, children: 0 };
  });

  // Computed: Seat fees from local assignments
  seatFees = computed(() => calculateSeatFees(this.localAssignments()));

  // Computed: Total price including seat fees
  totalWithFees = computed(() => {
    const base = this.bookingService.totalPrice();
    return base + this.seatFees();
  });

  // Computed: All passengers have seats assigned
  allSeatsAssigned = computed(() => {
    const assignments = this.localAssignments();
    return assignments.length > 0 && assignments.every(a => a.seatId !== null);
  });

  // Extra baggage
  extraBaggage = signal(0);

  increaseBaggage(): void {
    if (this.extraBaggage() < 2) {
      this.extraBaggage.update(v => v + 1);
      this.bookingService.updateExtras(this.extraBaggage());
    }
  }

  decreaseBaggage(): void {
    if (this.extraBaggage() > 0) {
      this.extraBaggage.update(v => v - 1);
      this.bookingService.updateExtras(this.extraBaggage());
    }
  }

  ngOnInit(): void {
    // Check if booking exists
    if (!this.selectedFlight()) {
      this.router.navigate(['/search']);
      return;
    }

    // Check if passengers exist
    if (this.passengers().length === 0) {
      this.router.navigate(['/passenger-info']);
      return;
    }

    // Initialize seat assignments
    this.bookingService.initializeSeatAssignments();

    // Copy assignments to local state
    const existingAssignments = this.bookingService.seatAssignments();
    if (existingAssignments.length > 0) {
      this.localAssignments.set([...existingAssignments]);
    }

    // Connect to socket and join flight room for real-time updates
    this.socketService.connect();
    const flightId = this.selectedFlight()?.id;
    if (flightId) {
      this.socketService.joinFlight(flightId);
      // Fetch real seat availability from backend
      this.loadSeatAvailability(flightId);
    }
  }

  // Load real seat availability from backend API
  private loadSeatAvailability(flightId: string): void {
    console.log('[SeatSelection] Loading seat availability for flight:', flightId);
    this.bookingService.getFlightSeats(flightId).subscribe(response => {
      console.log('[SeatSelection] Got seat response:', response ? response.seats?.length + ' seats' : 'null');
      if (response && response.seats) {
        // Merge backend availability into mock seat map
        this.updateSeatMapWithBackendData(response.seats);
      }
    });
  }

  // Update mock seat map with real availability from backend
  private updateSeatMapWithBackendData(backendSeats: SeatInfo[]): void {
    const currentMap = this.seatMap();

    // Create a map of seat number to availability
    const availabilityMap = new Map<string, boolean>();
    for (const seat of backendSeats) {
      availabilityMap.set(seat.seatNumber, seat.isAvailable);
    }

    // Log seat 10A specifically
    console.log('[SeatSelection] Seat 10A availability:', availabilityMap.get('10A'));

    // Count unavailable seats
    let unavailableCount = 0;
    let updatedCount = 0;

    // Update seat map with real availability
    const updatedRows = currentMap.rows.map(row => ({
      ...row,
      seats: row.seats.map(seat => {
        if (seat === 'aisle') return seat;
        const isAvailable = availabilityMap.get(seat.id);
        // If backend says seat is not available, mark as occupied
        if (isAvailable === false) {
          unavailableCount++;
          if (seat.status !== 'occupied') updatedCount++;
          return { ...seat, status: 'occupied' as const };
        }
        // If backend says available and mock said occupied, mark as available
        if (isAvailable === true && seat.status === 'occupied') {
          return { ...seat, status: 'available' as const };
        }
        return seat;
      })
    }));

    console.log('[SeatSelection] Unavailable seats:', unavailableCount, 'Updated:', updatedCount);
    this.seatMap.set({ ...currentMap, rows: updatedRows });
  }

  ngOnDestroy(): void {
    // Leave flight room when leaving page
    const flightId = this.selectedFlight()?.id;
    if (flightId) {
      this.socketService.leaveFlight(flightId);
    }
  }

  // Mark seats as occupied when another user books them
  private markSeatsAsOccupied(seatIds: string[]): void {
    const currentMap = this.seatMap();
    const updatedRows = currentMap.rows.map(row => ({
      ...row,
      seats: row.seats.map(seat => {
        if (seat === 'aisle') return seat;
        if (seatIds.includes(seat.id)) {
          return { ...seat, status: 'occupied' as const };
        }
        return seat;
      })
    }));

    this.seatMap.set({ ...currentMap, rows: updatedRows });

    // Clear any local assignments for these seats
    const assignments = this.localAssignments();
    const needsUpdate = assignments.some(a => a.seatId && seatIds.includes(a.seatId));
    if (needsUpdate) {
      const updated = assignments.map(a => {
        if (a.seatId && seatIds.includes(a.seatId)) {
          return { ...a, seatId: null, seat: null };
        }
        return a;
      });
      this.localAssignments.set(updated);
    }
  }

  onSeatSelect(event: { seat: Seat; passengerId: string | null }): void {
    const { seat, passengerId } = event;
    const assignments = [...this.localAssignments()];

    if (passengerId === null) {
      // Deselecting - find assignment with this seat and clear it
      const index = assignments.findIndex(a => a.seatId === seat.id);
      if (index !== -1) {
        assignments[index] = {
          ...assignments[index],
          seatId: null,
          seat: null
        };
      }
    } else {
      // Selecting - find the passenger's assignment and update it
      const index = assignments.findIndex(a => a.passengerId === passengerId);
      if (index !== -1) {
        // Clear any previous seat for this passenger
        const previousSeatId = assignments[index].seatId;

        // Update with new seat
        assignments[index] = {
          ...assignments[index],
          seatId: seat.id,
          seat: { ...seat, status: 'selected' }
        };
      }
    }

    this.localAssignments.set(assignments);
    // Save to booking service
    this.bookingService.updateSeatAssignments(assignments);
  }

  onContinue(): void {
    // Save final assignments
    this.bookingService.updateSeatAssignments(this.localAssignments());
    // Navigate to payment (placeholder for now)
    this.router.navigate(['/payment']);
  }

  onSkip(): void {
    // Clear seat assignments and proceed
    const clearedAssignments = this.localAssignments().map(a => ({
      ...a,
      seatId: null,
      seat: null
    }));
    this.bookingService.updateSeatAssignments(clearedAssignments);
    this.router.navigate(['/payment']);
  }

  onBack(): void {
    // Navigate back to passenger info
    this.router.navigate(['/passenger-info']);
  }
}
