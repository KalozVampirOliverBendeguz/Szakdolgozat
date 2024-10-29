import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
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

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startPicker" [(ngModel)]="project.startDate" name="startDate" required>
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Planned End Date</mat-label>
          <input matInput [matDatepicker]="endPicker" [(ngModel)]="project.plannedEndDate" name="plannedEndDate" required>
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="project.description" name="description" rows="4"></textarea>
        </mat-form-field>
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
  `]
})
export class ProjectDialogComponent {
  project = {
    name: '',
    projectManager: '',
    startDate: new Date(),
    plannedEndDate: new Date(),
    description: '',
    isActive: true
  };

  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>) { }

  onSubmit(): void {
    if (this.project.startDate && this.project.plannedEndDate) {
      this.dialogRef.close(this.project);
    }
  }
}
