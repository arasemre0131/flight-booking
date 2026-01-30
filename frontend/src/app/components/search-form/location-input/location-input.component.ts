import { Component, input, output, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Airport, formatAirportDisplay } from '../../../models/airport.model';
import { AirportService } from '../../../services/airport.service';

@Component({
  selector: 'app-location-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-input.component.html',
  styleUrl: './location-input.component.scss'
})
export class LocationInputComponent implements OnInit, OnDestroy {
  private airportService = inject(AirportService);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  label = input.required<string>();
  placeholder = input<string>('');
  value = input<Airport | null>(null);
  valueChange = output<Airport | null>();

  query = signal('');
  suggestions = signal<Airport[]>([]);
  isOpen = signal(false);
  isLoading = signal(false);
  highlightedIndex = signal(-1);

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          return [];
        }
        this.isLoading.set(true);
        return this.airportService.search(query);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.suggestions.set(results);
      this.isLoading.set(false);
      this.isOpen.set(results.length > 0);
    });

    // Initialize query from value
    const currentValue = this.value();
    if (currentValue) {
      this.query.set(currentValue.code);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.searchSubject.next(value);
    this.highlightedIndex.set(-1);

    if (value.length < 2) {
      this.suggestions.set([]);
      this.isOpen.set(false);
    }
  }

  onFocus(): void {
    if (this.suggestions().length > 0) {
      this.isOpen.set(true);
    }
  }

  onBlur(): void {
    // Delay to allow click on suggestion
    setTimeout(() => {
      this.isOpen.set(false);
    }, 200);
  }

  onKeydown(event: KeyboardEvent): void {
    const suggestions = this.suggestions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.update(i => Math.min(i + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        const index = this.highlightedIndex();
        if (index >= 0 && index < suggestions.length) {
          this.selectAirport(suggestions[index]);
        }
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
    }
  }

  selectAirport(airport: Airport): void {
    this.query.set(airport.code);
    this.valueChange.emit(airport);
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  clear(): void {
    this.query.set('');
    this.valueChange.emit(null);
    this.suggestions.set([]);
  }

  formatDisplay = formatAirportDisplay;
}
