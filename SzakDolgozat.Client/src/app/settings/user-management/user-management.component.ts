import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, User } from '../../services/user.service';
import { UserRole } from '../../auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="user-management-container">
      <div class="filters">
        <mat-form-field>
          <mat-label>Search Users</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Type to search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Filter by Role</mat-label>
          <mat-select [(ngModel)]="selectedRole" (selectionChange)="filterByRole()">
            <mat-option [value]="null">All Roles</mat-option>
            <mat-option [value]="UserRole.Admin">Admin</mat-option>
            <mat-option [value]="UserRole.Developer">Developer</mat-option>
            <mat-option [value]="UserRole.Reader">Reader</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="users" class="mat-elevation-z8">
        <!-- Username Column -->
        <ng-container matColumnDef="userName">
          <th mat-header-cell *matHeaderCellDef> Username </th>
          <td mat-cell *matCellDef="let user"> {{user.userName}} </td>
        </ng-container>

        <!-- Email Column -->
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef> Email </th>
          <td mat-cell *matCellDef="let user"> {{user.email}} </td>
        </ng-container>

        <!-- Role Column -->
        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef> Role </th>
          <td mat-cell *matCellDef="let user">
            <mat-form-field>
              <mat-select [(ngModel)]="user.role" (selectionChange)="updateUserRole(user)">
                <mat-option [value]="UserRole.Admin">Admin</mat-option>
                <mat-option [value]="UserRole.Developer">Developer</mat-option>
                <mat-option [value]="UserRole.Reader">Reader</mat-option>
              </mat-select>
            </mat-form-field>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let user">
            <button mat-icon-button color="warn" 
                    (click)="deleteUser(user)"
                    *ngIf="canDeleteUser(user)"
                    matTooltip="Delete User">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 20px;
    }

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .mat-mdc-form-field {
      width: 100%;
      max-width: 300px;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 80px;
      text-align: center;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['userName', 'email', 'role', 'actions'];
  selectedRole: UserRole | null = null;
  UserRole = UserRole;
  private adminCount = 0;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.updateAdminCount();
  }

  updateAdminCount() {
    this.userService.filterByRole(UserRole.Admin).subscribe({
      next: (users) => {
        this.adminCount = users.length;
      },
      error: (error) => console.error('Error counting admins:', error)
    });
  }

  canDeleteUser(user: User): boolean {
    return user.role !== UserRole.Admin || this.adminCount > 1;
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.userName}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
          if (user.role === UserRole.Admin) {
            this.updateAdminCount();
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open(error.error?.message || 'Error deleting user', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      this.userService.searchUsers(filterValue).subscribe({
        next: (users) => this.users = users,
        error: (error) => console.error('Error searching users:', error)
      });
    } else if (filterValue.length === 0) {
      this.loadUsers();
    }
  }

  filterByRole() {
    if (this.selectedRole !== null) {
      this.userService.filterByRole(this.selectedRole).subscribe({
        next: (users) => this.users = users,
        error: (error) => console.error('Error filtering users:', error)
      });
    } else {
      this.loadUsers();
    }
  }

  updateUserRole(user: User) {
    this.userService.updateUserRole(user.id, user.role).subscribe({
      next: () => {
        this.snackBar.open('User role updated successfully', 'Close', { duration: 3000 });
        this.loadUsers();
        this.updateAdminCount();
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        this.snackBar.open('Error updating user role', 'Close', { duration: 3000 });
      }
    });
  }
}
