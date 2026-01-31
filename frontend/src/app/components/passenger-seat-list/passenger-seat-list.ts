import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatAssignment } from '../../models/seat.model';

@Component({
  selector: 'app-passenger-seat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passenger-seat-list.html',
  styleUrl: './passenger-seat-list.scss'
})
export class PassengerSeatList {
  // Inputs
  seatAssignments = input<SeatAssignment[]>([]);

  // Computed: Count of assigned seats
  assignedCount = computed(() => {
    return this.seatAssignments().filter(a => a.seatId !== null).length;
  });

  // Computed: Total passengers
  totalPassengers = computed(() => {
    return this.seatAssignments().length;
  });

  // Computed: All passengers have seats
  allAssigned = computed(() => {
    return this.assignedCount() === this.totalPassengers();
  });

  // Get seat display string
  getSeatDisplay(assignment: SeatAssignment): string {
    if (!assignment.seatId || !assignment.seat) {
      return 'No seat selected';
    }
    const seat = assignment.seat;
    const typeLabel = seat.type === 'business' ? 'Business' :
                      seat.type === 'exit' ? 'Exit Row' : 'Economy';
    return `${assignment.seatId} (${typeLabel})`;
  }

  // Get seat fee display
  getSeatFee(assignment: SeatAssignment): number {
    return assignment.seat?.upgradePrice ?? 0;
  }
}
