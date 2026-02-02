// Users List Page - 012-admin-panel

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { DataTable, TableColumn, SortEvent } from '../../../../components/admin/data-table/data-table';
import { ConfirmationModal } from '../../../../components/admin/confirmation-modal/confirmation-modal';
import { UserForm } from '../user-form/user-form';
import { User, UserRole } from '../../../../models/auth.model';
import { UserFilters, PaginationParams, PaginatedResult } from '../../../../models/admin.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, ConfirmationModal, UserForm],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList implements OnInit {
  private adminService = inject(AdminService);

  // Table configuration
  columns: TableColumn[] = [
    { key: 'firstName', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', type: 'badge', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true }
  ];

  // State
  users = signal<User[]>([]);
  isLoading = signal(false);
  totalUsers = signal(0);
  totalPages = signal(0);

  // Filters
  searchTerm = signal('');
  roleFilter = signal<UserRole | 'all'>('all');
  statusFilter = signal<'active' | 'inactive' | 'all'>('all');

  // Pagination
  currentPage = signal(1);
  pageSize = 25;

  // Sort
  sortBy = signal<string | undefined>(undefined);
  sortOrder = signal<'asc' | 'desc'>('asc');

  // Modals
  showUserForm = signal(false);
  editingUser = signal<User | null>(null);
  showRoleConfirm = signal(false);
  roleChangeUser = signal<User | null>(null);
  newRole = signal<UserRole>('passenger');
  showStatusConfirm = signal(false);
  statusChangeUser = signal<User | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading.set(true);

    const filters: UserFilters = {
      search: this.searchTerm() || undefined,
      role: this.roleFilter(),
      status: this.statusFilter()
    };

    const pagination: PaginationParams = {
      page: this.currentPage(),
      pageSize: this.pageSize,
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    };

    const result = await this.adminService.getUsers(filters, pagination);

    this.users.set(result.items);
    this.totalUsers.set(result.total);
    this.totalPages.set(result.totalPages);
    this.isLoading.set(false);
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  onSort(event: SortEvent): void {
    this.sortBy.set(event.column);
    this.sortOrder.set(event.direction);
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadUsers();
  }

  // User form
  openCreateForm(): void {
    this.editingUser.set(null);
    this.showUserForm.set(true);
  }

  openEditForm(user: User): void {
    this.editingUser.set(user);
    this.showUserForm.set(true);
  }

  closeUserForm(): void {
    this.showUserForm.set(false);
    this.editingUser.set(null);
  }

  onUserSaved(): void {
    this.closeUserForm();
    this.loadUsers();
  }

  // Role change
  openRoleChange(user: User, event: Event): void {
    event.stopPropagation();
    this.roleChangeUser.set(user);
    this.newRole.set(user.role);
    this.showRoleConfirm.set(true);
  }

  async confirmRoleChange(): Promise<void> {
    const user = this.roleChangeUser();
    if (!user) return;

    await this.adminService.changeUserRole(user.id, this.newRole());
    this.showRoleConfirm.set(false);
    this.roleChangeUser.set(null);
    this.loadUsers();
  }

  cancelRoleChange(): void {
    this.showRoleConfirm.set(false);
    this.roleChangeUser.set(null);
  }

  // Status toggle
  openStatusToggle(user: User, event: Event): void {
    event.stopPropagation();
    this.statusChangeUser.set(user);
    this.showStatusConfirm.set(true);
  }

  async confirmStatusToggle(): Promise<void> {
    const user = this.statusChangeUser();
    if (!user) return;

    if ((user as any).status === 'active') {
      await this.adminService.deactivateUser(user.id);
    } else {
      await this.adminService.reactivateUser(user.id);
    }

    this.showStatusConfirm.set(false);
    this.statusChangeUser.set(null);
    this.loadUsers();
  }

  cancelStatusToggle(): void {
    this.showStatusConfirm.set(false);
    this.statusChangeUser.set(null);
  }

  onRowClick(user: User): void {
    this.openEditForm(user);
  }

  // Pagination helpers
  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getUserName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getStatusAction(): string {
    const user = this.statusChangeUser();
    return (user as any)?.status === 'active' ? 'deactivate' : 'reactivate';
  }
}
