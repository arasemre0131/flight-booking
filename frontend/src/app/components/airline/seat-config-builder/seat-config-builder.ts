// Seat Configuration Builder Component - 011-airline-dashboard

import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeatClassConfig } from '../../../models/aircraft.model';

@Component({
  selector: 'app-seat-config-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seat-config-builder.html',
  styleUrl: './seat-config-builder.scss'
})
export class SeatConfigBuilder {
  @Input() classType: 'economy' | 'business' | 'first' = 'economy';
  @Input() required = false;
  @Input() enabled = true;
  @Input() initialConfig: SeatClassConfig | null = null;

  @Output() configChange = new EventEmitter<SeatClassConfig | null>();
  @Output() enabledChange = new EventEmitter<boolean>();

  rows = signal(0);
  seatsPerRow = signal(0);
  totalSeats = signal(0);
  isEnabled = signal(true);

  constructor() {
    // Calculate total seats when rows or seatsPerRow changes
    effect(() => {
      const total = this.rows() * this.seatsPerRow();
      this.totalSeats.set(total);
      this.emitConfig();
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.isEnabled.set(this.enabled);

    if (this.initialConfig) {
      this.rows.set(this.initialConfig.rows);
      this.seatsPerRow.set(this.initialConfig.seatsPerRow);
    } else if (this.classType === 'economy') {
      // Default values for economy
      this.rows.set(20);
      this.seatsPerRow.set(6);
    }
  }

  get classLabel(): string {
    switch (this.classType) {
      case 'economy': return 'Economy Class';
      case 'business': return 'Business Class';
      case 'first': return 'First Class';
    }
  }

  get classIcon(): string {
    switch (this.classType) {
      case 'economy': return '💺';
      case 'business': return '🪑';
      case 'first': return '👑';
    }
  }

  onRowsChange(value: number): void {
    this.rows.set(Math.max(1, Math.min(50, value || 0)));
  }

  onSeatsPerRowChange(value: number): void {
    this.seatsPerRow.set(Math.max(1, Math.min(10, value || 0)));
  }

  toggleEnabled(): void {
    const newEnabled = !this.isEnabled();
    this.isEnabled.set(newEnabled);
    this.enabledChange.emit(newEnabled);

    if (!newEnabled) {
      this.rows.set(0);
      this.seatsPerRow.set(0);
    } else {
      // Set defaults when enabling
      if (this.classType === 'business') {
        this.rows.set(4);
        this.seatsPerRow.set(4);
      } else if (this.classType === 'first') {
        this.rows.set(2);
        this.seatsPerRow.set(2);
      }
    }
    this.emitConfig();
  }

  private emitConfig(): void {
    if (!this.isEnabled() || this.rows() === 0 || this.seatsPerRow() === 0) {
      this.configChange.emit(null);
    } else {
      this.configChange.emit({
        rows: this.rows(),
        seatsPerRow: this.seatsPerRow(),
        totalSeats: this.totalSeats()
      });
    }
  }

  getPreviewRows(): number[] {
    const count = Math.min(this.rows(), 5);
    return Array.from({ length: count }, (_, i) => i);
  }

  getSeatsArray(): number[] {
    return Array.from({ length: this.seatsPerRow() }, (_, i) => i);
  }
}
