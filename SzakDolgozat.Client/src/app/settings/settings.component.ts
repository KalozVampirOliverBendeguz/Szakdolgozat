import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserManagementComponent } from './user-management/user-management.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    UserManagementComponent,
    NotificationSettingsComponent
  ],
  template: `
    <div class="settings-container">
      <div>
        <h2>Beállítások</h2>
        <pre>Current Role: {{authService.getCurrentUserRole()}}</pre>
        <pre>Is Admin: {{authService.isAdmin()}}</pre>
      </div>

      <!-- Értesítési beállítások minden felhasználó számára -->
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Értesítési beállítások</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-expansion-panel [expanded]="showNotificationSettings">
            <mat-expansion-panel-header (click)="toggleNotificationSettings()">
              <mat-panel-title>
                Értesítések kezelése
              </mat-panel-title>
              <mat-panel-description>
                Beállíthatod a projekthatáridő értesítéseket
              </mat-panel-description>
            </mat-expansion-panel-header>
            
            <app-notification-settings></app-notification-settings>
          </mat-expansion-panel>
        </mat-card-content>
      </mat-card>

      <!-- Felhasználó kezelő csak adminok számára -->
      <div *ngIf="authService.isAdmin()">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>Felhasználók kezelése</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-expansion-panel [expanded]="showUserManagement">
              <mat-expansion-panel-header (click)="toggleUserManagement()">
                <mat-panel-title>
                  Felhasználók
                </mat-panel-title>
                <mat-panel-description>
                  Felhasználók és jogosultságok kezelése
                </mat-panel-description>
              </mat-expansion-panel-header>
              
              <app-user-management></app-user-management>
            </mat-expansion-panel>
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
      margin-bottom: 20px;
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
  showNotificationSettings = false;

  constructor(public authService: AuthService) { }

  toggleUserManagement() {
    this.showUserManagement = !this.showUserManagement;
    console.log('User management visibility:', this.showUserManagement);
    console.log('Is admin:', this.authService.isAdmin());
    console.log('Current role:', this.authService.getCurrentUserRole());
  }

  toggleNotificationSettings() {
    this.showNotificationSettings = !this.showNotificationSettings;
  }
}
