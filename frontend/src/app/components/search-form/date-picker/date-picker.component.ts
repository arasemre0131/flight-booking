import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  label = input.required<string>();
  value = input<Date | null>(null);
  minDate = input<Date | null>(null);
  valueChange = output<Date | null>();

  // Format date for input[type="date"]
  formattedValue = computed(() => {
    const date = this.value();
    if (!date) return '';
    return this.formatDateForInput(date);
  });

  // Minimum date for input (today or provided minDate)
  formattedMinDate = computed(() => {
    const min = this.minDate();
    if (min) {
      return this.formatDateForInput(min);
    }
    return this.formatDateForInput(new Date());
  });

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const [year, month, day] = input.value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      this.valueChange.emit(date);
    } else {
      this.valueChange.emit(null);
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format for display (e.g., "Feb 15")
  formatDisplayDate(date: Date | null): string {
    if (!date) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
}
