import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementComponent } from './user-management/user-management.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UserManagementComponent
  ],
  template: `
    <div class="settings-container">
      <div>
        <h2>Beállítások</h2>
        <pre>Current Role: {{authService.getCurrentUserRole()}}</pre>
        <pre>Is Admin: {{authService.isAdmin()}}</pre>
      </div>

      <div *ngIf="authService.isAdmin()">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>Felhasználók kezelése</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <button mat-raised-button color="primary" (click)="toggleUserManagement()">
              <mat-icon>manage_accounts</mat-icon>
              {{ showUserManagement ? 'Hide' : 'Show' }} User Management
            </button>

            <div *ngIf="showUserManagement" class="mt-4">
              <app-user-management></app-user-management>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .settings-card {
      margin-top: 20px;
    }

    button {
      margin: 10px 0;
    }

    .mt-4 {
      margin-top: 1rem;
    }
  `]
})
export class SettingsComponent {
  showUserManagement = false;

  constructor(public authService: AuthService) { }

  toggleUserManagement() {
    this.showUserManagement = !this.showUserManagement;
    console.log('User management visibility:', this.showUserManagement);
    console.log('Is admin:', this.authService.isAdmin());
    console.log('Current role:', this.authService.getCurrentUserRole());
  }
}
