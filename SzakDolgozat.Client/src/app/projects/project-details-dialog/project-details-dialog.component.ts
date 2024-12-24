import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Project } from '../../services/project.service';
import { AuthService } from '../../auth.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { UserService, User } from '../../services/user.service';
import { ProjectReport, ProjectReportService } from '../../services/project-report.service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-project-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSelectModule,
    MatExpansionModule
  ],
  template: `
   <div class="dialog-container">
     <h2 mat-dialog-title>Project Details</h2>
     
     <mat-dialog-content>
       <div class="form-container">
         <mat-form-field appearance="outline" class="full-width">
           <mat-label>Project Name</mat-label>
           <input matInput [(ngModel)]="data.name" [readonly]="!canEdit">
         </mat-form-field>

         <mat-form-field appearance="outline" class="full-width">
           <mat-label>Project Manager</mat-label>
           <input matInput [(ngModel)]="data.projectManager" [readonly]="!canEdit">
         </mat-form-field>

         <div class="date-container">
           <mat-form-field appearance="outline">
             <mat-label>Start Date</mat-label>
             <input matInput [matDatepicker]="startPicker" [(ngModel)]="data.startDate" [readonly]="!canEdit">
             <mat-datepicker-toggle matIconSuffix [for]="startPicker" [disabled]="!canEdit"></mat-datepicker-toggle>
             <mat-datepicker #startPicker></mat-datepicker>
           </mat-form-field>

           <mat-form-field appearance="outline">
             <mat-label>Planned End Date</mat-label>
             <input matInput [matDatepicker]="endPicker" [(ngModel)]="data.plannedEndDate" [readonly]="!canEdit">
             <mat-datepicker-toggle matIconSuffix [for]="endPicker" [disabled]="!canEdit"></mat-datepicker-toggle>
             <mat-datepicker #endPicker></mat-datepicker>
           </mat-form-field>
         </div>

         <mat-form-field appearance="outline" class="full-width">
           <mat-label>Description</mat-label>
           <textarea matInput [(ngModel)]="data.description" [readonly]="!canEdit" rows="4"></textarea>
         </mat-form-field>

         <mat-form-field appearance="outline" class="full-width">
           <mat-label>Repository URL</mat-label>
           <input matInput [(ngModel)]="data.repository" [readonly]="!canEdit" placeholder="https://github.com/your-repo">
           <a *ngIf="data.repository" [href]="data.repository" target="_blank" matSuffix>
             <mat-icon>open_in_new</mat-icon>
           </a>
         </mat-form-field>

         <mat-form-field appearance="outline" class="full-width">
           <mat-label>Assigned Users</mat-label>
           <mat-select [(ngModel)]="data.assignedUsers" [disabled]="!canEdit" multiple>
             <mat-option *ngFor="let user of availableUsers" [value]="user">
               {{user.email}} ({{user.userName}})
             </mat-option>
           </mat-select>
         </mat-form-field>

         <div class="assigned-users" *ngIf="data.assignedUsers?.length">
           <h4>Assigned Users:</h4>
           <mat-chip-listbox>
             <mat-chip *ngFor="let user of data.assignedUsers" [removable]="canEdit" (removed)="removeUser(user)">
               {{user.email}}
               <mat-icon matChipRemove *ngIf="canEdit">cancel</mat-icon>
             </mat-chip>
           </mat-chip-listbox>
         </div>

         <div class="status-section">
           <p>Current Status: 
             <span [class.active-status]="data.isActive" 
                   [class.inactive-status]="!data.isActive">
               {{data.isActive ? 'Active' : 'Inactive'}}
             </span>
           </p>
         </div>

         <!-- Reports section -->
         <div class="reports-section">
           <h3>Project Reports</h3>
           
           <mat-expansion-panel *ngIf="canEdit">
             <mat-expansion-panel-header>
               <mat-panel-title>Add New Report</mat-panel-title>
             </mat-expansion-panel-header>

             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Report Title</mat-label>
               <input matInput [(ngModel)]="newReport.title" required>
             </mat-form-field>

             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Report Type</mat-label>
               <mat-select [(ngModel)]="newReport.reportType" required>
                 <mat-option value="Progress">Progress Report</mat-option>
                 <mat-option value="Issue">Issue Report</mat-option>
                 <mat-option value="Milestone">Milestone Report</mat-option>
               </mat-select>
             </mat-form-field>

             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Content</mat-label>
               <textarea matInput [(ngModel)]="newReport.content" rows="4" required></textarea>
             </mat-form-field>

             <button mat-raised-button color="primary" (click)="submitReport()">
               Submit Report
             </button>
           </mat-expansion-panel>

           <div class="reports-list">
             <mat-expansion-panel *ngFor="let report of reports">
               <mat-expansion-panel-header>
                 <mat-panel-title>
                   {{report.title}}
                   <span class="report-type">{{report.reportType}}</span>
                 </mat-panel-title>
                 <mat-panel-description>
                   {{report.createdAt | date:'medium'}}
                 </mat-panel-description>
               </mat-expansion-panel-header>
               
               <p>{{report.content}}</p>
               <p class="report-author">By: {{report.createdBy?.userName}}</p>
             </mat-expansion-panel>
           </div>
         </div>

         <div class="documentation-section">
           <h3>Project Documentation</h3>
           <button mat-stroked-button color="primary" class="upload-button" [disabled]="!canEdit">
             <mat-icon>upload_file</mat-icon>
             Upload Documentation
           </button>
           <p class="documentation-note">No documentation uploaded yet</p>
         </div>
       </div>
     </mat-dialog-content>

     <mat-dialog-actions align="end">
      <button mat-stroked-button color="primary" (click)="toggleStatus()" *ngIf="authService.isAdmin()">
         {{data.isActive ? 'Deactivate' : 'Activate'}} Project
      </button>
       <button mat-stroked-button color="primary" (click)="saveChanges()" *ngIf="canEdit">
         Save Changes
       </button>
       <button mat-button color="warn" (click)="close()">Close</button>
     </mat-dialog-actions>
   </div>
 `,
  styles: [`
   .dialog-container {
     padding: 20px;
     min-width: 500px;
   }

   .form-container {
     display: flex;
     flex-direction: column;
     gap: 16px;
   }

   .full-width {
     width: 100%;
   }

   .date-container {
     display: flex;
     gap: 16px;
   }

   .date-container mat-form-field {
     flex: 1;
   }

   .status-section {
     background-color: #f5f5f5;
     padding: 16px;
     border-radius: 4px;
   }

   .active-status {
     color: #4CAF50;
     font-weight: bold;
   }

   .inactive-status {
     color: #F44336;
     font-weight: bold;
   }

   .documentation-section {
     margin-top: 20px;
     padding-top: 20px;
     border-top: 1px solid #e0e0e0;
   }

   .documentation-section h3 {
     margin: 0 0 16px 0;
     font-size: 16px;
   }

   .upload-button {
     display: flex;
     align-items: center;
     gap: 8px;
   }

   .documentation-note {
     margin-top: 8px;
     color: #666;
     font-style: italic;
   }

   mat-dialog-actions {
     margin-top: 24px;
   }

   a {
     color: #3f51b5;
     text-decoration: none;
   }

   .assigned-users {
     margin-top: 8px;
   }

   mat-chip-listbox {
     display: flex;
     flex-wrap: wrap;
     gap: 8px;
   }

   .reports-section {
     margin-top: 24px;
     border-top: 1px solid #e0e0e0;
     padding-top: 24px;
   }

   .reports-list {
     margin-top: 16px;
   }

   .report-type {
     margin-left: 8px;
     font-size: 0.8em;
     color: #666;
   }

   .report-author {
     font-size: 0.9em;
     color: #666;
     margin-top: 8px;
   }
 `]
})
export class ProjectDetailsDialogComponent implements OnInit {
  availableUsers: User[] = [];
  canEdit: boolean = true;
  reports: ProjectReport[] = [];
  newReport: Partial<ProjectReport> = {
    title: '',
    content: '',
    reportType: 'Progress'
  };

  constructor(
    public dialogRef: MatDialogRef<ProjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private reportService: ProjectReportService,
    private userService: UserService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadReports();
    this.loadUsers();
  }

  loadReports() {
    if (this.data.id) {
      this.reportService.getProjectReports(this.data.id).subscribe({
        next: (reports) => this.reports = reports,
        error: (error) => console.error('Error loading reports:', error)
      });
    }
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => this.availableUsers = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  submitReport() {
    if (!this.newReport.title || !this.newReport.content || !this.data.id) {
      return;
    }

    const report = {
      projectId: this.data.id,
      title: this.newReport.title,
      content: this.newReport.content,
      reportType: 'Progress' // Fix érték egyelőre
    };

    this.reportService.createReport(report).subscribe({
      next: () => {
        this.loadReports();
        this.newReport = { title: '', content: '', reportType: 'Progress' };
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  removeUser(user: User) {
    if (this.data.assignedUsers) {
      const index = this.data.assignedUsers.indexOf(user);
      if (index >= 0) {
        this.data.assignedUsers.splice(index, 1);
      }
    }
  }

  toggleStatus(): void {
    this.data.isActive = !this.data.isActive;
    this.dialogRef.close({ action: 'toggle', project: this.data });
  }

  saveChanges(): void {
    console.log('Saving changes:', this.data);
    this.dialogRef.close({ action: 'save', project: this.data });
  }

  close(): void {
    this.dialogRef.close();
  }
}
