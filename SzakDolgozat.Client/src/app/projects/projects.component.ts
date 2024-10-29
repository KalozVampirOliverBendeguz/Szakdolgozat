// src/app/projects/projects.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ProjectService } from '../services/project.service';
import { Project } from '../services/project.service'; // külön import a Project interface-hez

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="projects-container">
      <div class="header">
        <h2>Projects</h2>
        <button mat-raised-button color="primary" (click)="openAddProjectDialog()">
          <mat-icon>add</mat-icon>
          Add New Project
        </button>
      </div>

      <div class="projects-list" *ngIf="projects.length > 0; else noProjects">
        <mat-card *ngFor="let project of projects">
          <mat-card-header>
            <mat-card-title>{{project.name}}</mat-card-title>
            <mat-card-subtitle>Manager: {{project.projectManager}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Start Date:</strong> {{project.startDate | date}}</p>
            <p><strong>Planned End Date:</strong> {{project.plannedEndDate | date}}</p>
            <p><strong>Status:</strong> {{project.isActive ? 'Active' : 'Inactive'}}</p>
            <p *ngIf="project.description"><strong>Description:</strong> {{project.description}}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="toggleProjectStatus(project)">
              {{project.isActive ? 'Deactivate' : 'Activate'}}
            </button>
            <button mat-button color="warn" (click)="deleteProject(project)">
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <ng-template #noProjects>
        <mat-card>
          <mat-card-content>
            <p>No projects found. Click the button above to add a new project.</p>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .projects-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .projects-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    console.log('Loading projects...'); // Debug logging
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        console.log('Projects loaded:', projects); // Debug logging
        this.projects = projects;
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Creating project:', result); // Debug logging
        this.projectService.createProject(result).subscribe({
          next: () => {
            console.log('Project created successfully'); // Debug logging
            this.loadProjects();
          },
          error: (error: any) => {
            console.error('Error creating project:', error);
          }
        });
      }
    });
  }

  toggleProjectStatus(project: Project): void {
    if (project.id) {
      this.projectService.toggleProjectStatus(project.id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (error: any) => {
          console.error('Error toggling project status:', error);
        }
      });
    }
  }

  deleteProject(project: Project): void {
    if (project.id && confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (error: any) => {
          console.error('Error deleting project:', error);
        }
      });
    }
  }





}


