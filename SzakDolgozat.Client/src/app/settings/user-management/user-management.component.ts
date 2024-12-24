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
    MatIconModule
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
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['userName', 'email', 'role'];
  selectedRole: UserRole | null = null;
  UserRole = UserRole;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }




  ngOnInit() {
    console.log('UserManagement initialized'); // Debug log
    this.loadUsers();
  }

  loadUsers() {
    console.log('Loading users...'); // Debug log
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Users loaded:', users); // Debug log
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
        console.log('User role updated successfully');
        this.loadUsers();
      },
      error: (error) => console.error('Error updating user role:', error)
    });
  }
}
