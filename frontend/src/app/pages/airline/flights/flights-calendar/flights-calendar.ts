// Flights Calendar Page - 011-airline-dashboard

import { Component, inject, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirlineService } from '../../../../services/airline.service';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  flightCount: number;
}

@Component({
  selector: 'app-flights-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flights-calendar.html',
  styleUrl: './flights-calendar.scss'
})
export class FlightsCalendar {
  private airlineService = inject(AirlineService);

  @Output() dateSelected = new EventEmitter<Date>();

  currentDate = signal(new Date());
  selectedDate = signal<Date | null>(null);

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  calendarDays = computed(() => {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        flightCount: this.getFlightCountForDate(date)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === today.toDateString();
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday,
        flightCount: this.getFlightCountForDate(date)
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false,
        flightCount: this.getFlightCountForDate(date)
      });
    }

    return days;
  });

  monthYearDisplay = computed(() => {
    return this.currentDate().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  });

  private getFlightCountForDate(date: Date): number {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.airlineService.flights().filter(f => {
      const flightDate = new Date(f.departureTime);
      return flightDate >= startOfDay && flightDate <= endOfDay;
    }).length;
  }

  previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  goToToday(): void {
    this.currentDate.set(new Date());
    this.selectDate(new Date());
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.dateSelected.emit(date);
  }

  isSelected(day: CalendarDay): boolean {
    if (!this.selectedDate()) return false;
    return day.date.toDateString() === this.selectedDate()!.toDateString();
  }
}
