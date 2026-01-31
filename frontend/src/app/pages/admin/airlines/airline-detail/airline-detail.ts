// Airline Detail Page - 012-admin-panel

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { ConfirmationModal } from '../../../../components/admin/confirmation-modal/confirmation-modal';
import { DataTable, TableColumn } from '../../../../components/admin/data-table/data-table';
import { AirlineSummary } from '../../../../models/admin.model';
import { User } from '../../../../models/auth.model';

@Component({
  selector: 'app-airline-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModal, DataTable],
  templateUrl: './airline-detail.html',
  styleUrl: './airline-detail.scss'
})
export class AirlineDetail implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // State
  airline = signal<AirlineSummary | null>(null);
  operators = signal<User[]>([]);
  availableUsers = signal<User[]>([]);
  isLoading = signal(true);

  // Assign user
  selectedUserId = signal('');

  // Modals
  showSuspendConfirm = signal(false);
  showAssignConfirm = signal(false);

  // Operators table config
  operatorColumns: TableColumn[] = [
    { key: 'firstName', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', type: 'status' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAirline(id);
    }
  }

  async loadAirline(id: string): Promise<void> {
    this.isLoading.set(true);

    const airline = await this.adminService.getAirlineById(id);
    this.airline.set(airline);

    if (airline) {
      // Load operators assigned to this airline
      const allUsers = await this.adminService.getUsers({}, { page: 1, pageSize: 1000 });
      const operators = allUsers.items.filter((u: any) => u.airlineId === id && u.role === 'airline');
      this.operators.set(operators);

      // Load available users (airline role without assignment)
      const available = allUsers.items.filter((u: any) => u.role === 'airline' && !u.airlineId);
      this.availableUsers.set(available);
    }

    this.isLoading.set(false);
  }

  goBack(): void {
    this.router.navigate(['/admin/airlines']);
  }

  // Suspend/Resume
  openSuspendConfirm(): void {
    this.showSuspendConfirm.set(true);
  }

  async confirmSuspend(): Promise<void> {
    const airline = this.airline();
    if (!airline) return;

    if (airline.status === 'active') {
      await this.adminService.suspendAirline(airline.id);
    } else {
      await this.adminService.resumeAirline(airline.id);
    }

    this.showSuspendConfirm.set(false);
    this.loadAirline(airline.id);
  }

  cancelSuspend(): void {
    this.showSuspendConfirm.set(false);
  }

  getSuspendAction(): string {
    return this.airline()?.status === 'active' ? 'suspend' : 'resume';
  }

  // Assign user
  openAssignConfirm(): void {
    if (!this.selectedUserId()) return;
    this.showAssignConfirm.set(true);
  }

  async confirmAssign(): Promise<void> {
    const airline = this.airline();
    const userId = this.selectedUserId();
    if (!airline || !userId) return;

    await this.adminService.assignUserToAirline(userId, airline.id);

    this.showAssignConfirm.set(false);
    this.selectedUserId.set('');
    this.loadAirline(airline.id);
  }

  cancelAssign(): void {
    this.showAssignConfirm.set(false);
  }

  getSelectedUserName(): string {
    const user = this.availableUsers().find(u => u.id === this.selectedUserId());
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  getOperatorName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
