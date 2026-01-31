// Stats Card Component - 012-admin-panel

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card" [class]="variant">
      <div class="card-icon" *ngIf="icon">{{ icon }}</div>
      <div class="card-content">
        <div class="card-value">{{ formattedValue }}</div>
        <div class="card-label">{{ label }}</div>
        @if (subtext) {
          <div class="card-subtext">{{ subtext }}</div>
        }
      </div>
      @if (trend) {
        <div class="card-trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
          {{ trend > 0 ? '+' : '' }}{{ trend }}%
        </div>
      }
    </div>
  `,
  styles: [`
    .stats-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      position: relative;

      &.primary {
        background: linear-gradient(135deg, #605dec 0%, #8b5cf6 100%);
        color: white;

        .card-label,
        .card-subtext {
          color: rgba(255, 255, 255, 0.8);
        }

        .card-trend {
          color: rgba(255, 255, 255, 0.9);
        }
      }

      &.success {
        border-left: 4px solid #22c55e;
      }

      &.warning {
        border-left: 4px solid #f59e0b;
      }

      &.danger {
        border-left: 4px solid #ef4444;
      }
    }

    .card-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.2;

      .primary & {
        color: white;
      }
    }

    .card-label {
      font-size: 0.875rem;
      color: #666;
      margin-top: 0.25rem;
    }

    .card-subtext {
      font-size: 0.75rem;
      color: #999;
      margin-top: 0.25rem;
    }

    .card-trend {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;

      &.positive {
        color: #22c55e;
        background: #dcfce7;

        .primary & {
          background: rgba(255, 255, 255, 0.2);
          color: #a7f3d0;
        }
      }

      &.negative {
        color: #ef4444;
        background: #fee2e2;

        .primary & {
          background: rgba(255, 255, 255, 0.2);
          color: #fca5a5;
        }
      }
    }
  `]
})
export class StatsCard {
  @Input() icon = '';
  @Input() value: number | string = 0;
  @Input() label = '';
  @Input() subtext = '';
  @Input() trend?: number;
  @Input() variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'default';
  @Input() format: 'number' | 'currency' | 'percent' = 'number';

  get formattedValue(): string {
    if (typeof this.value === 'string') return this.value;

    switch (this.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(this.value);
      case 'percent':
        return `${this.value}%`;
      default:
        return new Intl.NumberFormat('en-US').format(this.value);
    }
  }
}
