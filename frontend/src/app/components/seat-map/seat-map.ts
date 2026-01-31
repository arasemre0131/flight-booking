import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seat, SeatRow, SeatMap, SeatAssignment } from '../../models/seat.model';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-map.html',
  styleUrl: './seat-map.scss'
})
export class SeatMapComponent {
  // Inputs
  seatMap = input.required<SeatMap>();
  seatAssignments = input<SeatAssignment[]>([]);

  // Outputs
  seatSelect = output<{ seat: Seat; passengerId: string | null }>();

  // Track selected seat IDs for styling
  selectedSeatIds = computed(() => {
    return new Set(
      this.seatAssignments()
        .filter(a => a.seatId !== null)
        .map(a => a.seatId!)
    );
  });

  // Check if a seat is selected
  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeatIds().has(seat.id);
  }

  // Get seat status for styling
  getSeatStatus(seat: Seat): string {
    if (seat.status === 'occupied') return 'occupied';
    if (this.isSeatSelected(seat)) return 'selected';
    return 'available';
  }

  // Get seat CSS classes
  getSeatClasses(seat: Seat): string {
    const classes = ['seat', seat.type];
    const status = this.getSeatStatus(seat);
    classes.push(status);
    if (seat.upgradePrice > 0) {
      classes.push('premium');
    }
    return classes.join(' ');
  }

  // Handle seat click
  onSeatClick(seat: Seat): void {
    if (seat.status === 'occupied') return;

    const assignments = this.seatAssignments();
    const isCurrentlySelected = this.isSeatSelected(seat);

    if (isCurrentlySelected) {
      // Deselect: find passenger with this seat and emit deselection
      const assignment = assignments.find(a => a.seatId === seat.id);
      if (assignment) {
        this.seatSelect.emit({ seat, passengerId: null });
      }
    } else {
      // Select: find first unassigned passenger
      const unassigned = assignments.find(a => a.seatId === null);
      if (unassigned) {
        this.seatSelect.emit({ seat, passengerId: unassigned.passengerId });
      } else if (assignments.length > 0) {
        // All assigned - replace last assigned (optional behavior)
        const lastAssigned = assignments[assignments.length - 1];
        this.seatSelect.emit({ seat, passengerId: lastAssigned.passengerId });
      }
    }
  }

  // Check if item is a seat (not aisle)
  isSeat(item: Seat | 'aisle'): item is Seat {
    return item !== 'aisle';
  }

  // Get assigned passenger name for a seat (for tooltip)
  getAssignedPassenger(seat: Seat): string | null {
    const assignment = this.seatAssignments().find(a => a.seatId === seat.id);
    return assignment?.passengerName ?? null;
  }
}
