import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../auth.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Project</h2>
    <mat-dialog-content>
      <form #projectForm="ngForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Project Name</mat-label>
          <input matInput [(ngModel)]="project.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Project Manager</mat-label>
          <input matInput [(ngModel)]="project.projectManager" name="projectManager" required>
        </mat-form-field>

        <!-- Dátum és idő mezők -->
        <div class="date-time-section">
          <mat-form-field appearance="fill" class="date-field">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate" name="startDate" required>
            <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill" class="time-field">
            <mat-label>Start Time</mat-label>
            <input matInput type="time" [(ngModel)]="startTime" name="startTime" required>
          </mat-form-field>
        </div>

        <div class="date-time-section">
          <mat-form-field appearance="fill" class="date-field">
            <mat-label>Planned End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate" name="endDate" required>
            <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill" class="time-field">
            <mat-label>End Time</mat-label>
            <input matInput type="time" [(ngModel)]="endTime" name="endTime" required>
          </mat-form-field>
        </div>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="project.description" name="description" rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Repository URL</mat-label>
          <input matInput [(ngModel)]="project.repository" name="repository" placeholder="https://github.com/your-repo">
          <mat-icon matSuffix>link</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Assign Users</mat-label>
          <mat-select [(ngModel)]="project.assignedUsers" name="assignedUsers" multiple>
            <mat-option *ngFor="let user of availableUsers" [value]="user">
              {{user.email}} ({{user.userName}})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="selected-users" *ngIf="project.assignedUsers?.length">
          <h4>Selected Users:</h4>
          <mat-chip-listbox>
            <mat-chip *ngFor="let user of project.assignedUsers" removable (removed)="removeUser(user)">
              {{user.email}}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </mat-chip-listbox>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!projectForm.form.valid">
        Create Project
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    textarea {
      min-height: 100px;
    }
    .selected-users {
      margin-top: 15px;
    }
    mat-chip-listbox {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .date-time-section {
      display: flex;
      gap: 16px;
      margin-bottom: 15px;
    }
    .date-field {
      flex: 3;
    }
    .time-field {
      flex: 1;
    }
  `]
})
export class ProjectDialogComponent implements OnInit {
  project = {
    name: '',
    projectManager: '',
    startDate: new Date(),
    plannedEndDate: new Date(),
    description: '',
    repository: '',
    isActive: true,
    assignedUsers: [] as User[]
  };

  // Külön kezeljük a dátum és idő komponenseket
  startDate: Date = new Date();
  startTime: string = this.formatTime(new Date());
  endDate: Date = new Date();
  endTime: string = this.formatTime(new Date());

  availableUsers: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  removeUser(user: User) {
    const index = this.project.assignedUsers.indexOf(user);
    if (index >= 0) {
      this.project.assignedUsers.splice(index, 1);
    }
  }

  onSubmit(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.snackBar.open('Error: User not authenticated', 'Close', { duration: 3000 });
      return;
    }

    const combinedStartDateTime = this.combineDateAndTime(this.startDate, this.startTime);
    const combinedEndDateTime = this.combineDateAndTime(this.endDate, this.endTime);

    const projectData = {
      name: this.project.name,
      projectManager: this.project.projectManager,
      startDate: combinedStartDateTime,
      plannedEndDate: combinedEndDateTime,
      description: this.project.description,
      repository: this.project.repository,
      assignedUsers: this.project.assignedUsers.map(user => user.id),
      createdById: userId
    };

    this.dialogRef.close(projectData);
  }

  combineDateAndTime(date: Date, timeString: string): Date {
    // Feldolgozzuk a dátum és idő komponenseket
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Feldolgozzuk az idő komponenseket
    const [hours, minutes] = timeString.split(':').map(Number);

    // Létrehozunk egy új dátumot a pontos időponttal
    const result = new Date(year, month, day, hours, minutes, 0, 0);

    console.log(`Created exact datetime: ${result.toLocaleString()} from ${date.toDateString()} and ${timeString}`);
    return result;
  }
}
