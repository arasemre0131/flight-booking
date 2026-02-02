// Data Table Component - 012-admin-panel

import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'currency' | 'status' | 'badge';
  width?: string;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No data found';
  @Input() emptyHint = 'Try adjusting your filters';

  @Output() sort = new EventEmitter<SortEvent>();
  @Output() rowClick = new EventEmitter<any>();

  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  onHeaderClick(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn() === column.key) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column.key);
      this.sortDirection.set('asc');
    }

    this.sort.emit({
      column: column.key,
      direction: this.sortDirection()
    });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  getCellValue(row: any, column: TableColumn): any {
    const value = row[column.key];

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) : '-';
      case 'currency':
        return value != null ? `€${(value / 100).toFixed(2)}` : '-';
      case 'status':
      case 'badge':
        return value || '-';
      default:
        return value ?? '-';
    }
  }

  getStatusClass(value: string): string {
    const statusMap: Record<string, string> = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'suspended': 'status-suspended',
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'cancelled': 'status-cancelled',
      'completed': 'status-completed',
      'paid': 'status-paid',
      'refunded': 'status-refunded'
    };
    return statusMap[value?.toLowerCase()] || '';
  }
}
