// Aircraft Form Page - 011-airline-dashboard

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AirlineService } from '../../../../services/airline.service';
import { Aircraft, SeatClassConfig } from '../../../../models/aircraft.model';
import { SeatConfigBuilder } from '../../../../components/airline/seat-config-builder/seat-config-builder';

@Component({
  selector: 'app-aircraft-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SeatConfigBuilder],
  templateUrl: './aircraft-form.html',
  styleUrl: './aircraft-form.scss'
})
export class AircraftForm implements OnInit {
  private fb = inject(FormBuilder);
  private airlineService = inject(AirlineService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = signal(false);
  aircraftId = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  warning = signal<string | null>(null);

  economyConfig = signal<SeatClassConfig | null>(null);
  businessConfig = signal<SeatClassConfig | null>(null);
  firstClassConfig = signal<SeatClassConfig | null>(null);
  businessEnabled = signal(false);
  firstEnabled = signal(false);
  totalSeats = signal(0);

  hasScheduledFlights = signal(false);
  originalTotalSeats = signal(0);

  initialEconomyConfig: SeatClassConfig | null = null;
  initialBusinessConfig: SeatClassConfig | null = null;
  initialFirstConfig: SeatClassConfig | null = null;

  ngOnInit(): void {
    this.initForm();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.aircraftId.set(id);
      this.loadAircraft(id);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      model: ['', [Validators.required, Validators.minLength(2)]],
      registration: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{4,10}$/)]]
    });
  }

  private loadAircraft(id: string): void {
    const aircraft = this.airlineService.getAircraftById(id);
    if (aircraft) {
      this.form.patchValue({
        model: aircraft.model,
        registration: aircraft.registration
      });

      this.initialEconomyConfig = aircraft.economyConfig;
      this.initialBusinessConfig = aircraft.businessConfig;
      this.initialFirstConfig = aircraft.firstClassConfig;

      this.economyConfig.set(aircraft.economyConfig);
      this.businessConfig.set(aircraft.businessConfig);
      this.firstClassConfig.set(aircraft.firstClassConfig);

      this.businessEnabled.set(!!aircraft.businessConfig);
      this.firstEnabled.set(!!aircraft.firstClassConfig);

      this.originalTotalSeats.set(aircraft.totalSeats);
      this.updateTotalSeats();

      // Check for scheduled flights
      this.hasScheduledFlights.set(this.airlineService.hasScheduledFlights(id));
    } else {
      this.error.set('Aircraft not found');
    }
  }

  onEconomyConfigChange(config: SeatClassConfig | null): void {
    this.economyConfig.set(config);
    this.updateTotalSeats();
    this.checkCapacityWarning();
  }

  onBusinessConfigChange(config: SeatClassConfig | null): void {
    this.businessConfig.set(config);
    this.updateTotalSeats();
    this.checkCapacityWarning();
  }

  onFirstClassConfigChange(config: SeatClassConfig | null): void {
    this.firstClassConfig.set(config);
    this.updateTotalSeats();
    this.checkCapacityWarning();
  }

  onBusinessEnabledChange(enabled: boolean): void {
    this.businessEnabled.set(enabled);
    if (!enabled) {
      this.businessConfig.set(null);
      this.updateTotalSeats();
    }
  }

  onFirstEnabledChange(enabled: boolean): void {
    this.firstEnabled.set(enabled);
    if (!enabled) {
      this.firstClassConfig.set(null);
      this.updateTotalSeats();
    }
  }

  private updateTotalSeats(): void {
    const economy = this.economyConfig()?.totalSeats || 0;
    const business = this.businessConfig()?.totalSeats || 0;
    const first = this.firstClassConfig()?.totalSeats || 0;
    this.totalSeats.set(economy + business + first);
  }

  private checkCapacityWarning(): void {
    if (this.isEditMode() && this.hasScheduledFlights()) {
      if (this.totalSeats() < this.originalTotalSeats()) {
        this.warning.set(
          `Warning: Reducing seat capacity from ${this.originalTotalSeats()} to ${this.totalSeats()} seats. ` +
          `This aircraft has scheduled flights. Ensure no flight has more bookings than the new capacity.`
        );
      } else {
        this.warning.set(null);
      }
    }
  }

  get canSave(): boolean {
    if (this.form.invalid) return false;
    if (!this.economyConfig()) return false;
    if (this.totalSeats() === 0) return false;
    return true;
  }

  async onSubmit(): Promise<void> {
    if (!this.canSave) return;

    this.isLoading.set(true);
    this.error.set(null);

    const aircraftData = {
      model: this.form.value.model,
      registration: this.form.value.registration.toUpperCase(),
      economyConfig: this.economyConfig()!,
      businessConfig: this.businessConfig(),
      firstClassConfig: this.firstClassConfig()
    };

    try {
      if (this.isEditMode() && this.aircraftId()) {
        await this.airlineService.updateAircraft(this.aircraftId()!, aircraftData);
      } else {
        await this.airlineService.createAircraft(aircraftData);
      }
      this.router.navigate(['/airline/aircraft']);
    } catch (err: any) {
      this.error.set(err.message || 'An error occurred');
    } finally {
      this.isLoading.set(false);
    }
  }
}
