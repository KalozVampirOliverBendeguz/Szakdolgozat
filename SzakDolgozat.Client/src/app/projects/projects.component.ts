import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ProjectDetailsDialogComponent } from './project-details-dialog/project-details-dialog.component';
import { ProjectService } from '../services/project.service';
import { Project } from '../services/project.service';
import { AuthService } from '../auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';  


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonToggleModule
  ],
  template: `
    <div class="projects-container">
      <div class="header">
        <h2>Projektek</h2>
        <div class="header-controls">
          <mat-button-toggle-group [(ngModel)]="currentView">
            <mat-button-toggle value="card">
              <mat-icon>grid_view</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="table">
              <mat-icon>table_view</mat-icon>
            </mat-button-toggle>
          </mat-button-toggle-group>
          <button mat-raised-button color="primary" 
                  *ngIf="!authService.isReader()"
                  (click)="openAddProjectDialog()">
            <mat-icon>add</mat-icon>
            Új projekt
          </button>
        </div>
      </div>

      <!-- Kártya nézet -->
      <div class="projects-list" *ngIf="currentView === 'card' && projects.length > 0">
        <mat-card *ngFor="let project of projects" class="project-card">
          <mat-card-header>
            <mat-card-title>{{project.name}}</mat-card-title>
            <mat-card-subtitle>Projektvezető: {{project.projectManager}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content (click)="openProjectDetails(project)">
            <p><strong>Kezdés:</strong> {{project.startDate | date}}</p>
            <p><strong>Tervezett befejezés:</strong> {{project.plannedEndDate | date}}</p>
            <p><strong>Státusz:</strong> 
              <span [class.status-active]="project.isActive" 
                    [class.status-inactive]="!project.isActive">
                {{project.isActive ? 'Aktív' : 'Inaktív'}}
              </span>
            </p>
            <p *ngIf="project.description"><strong>Leírás:</strong> {{project.description}}</p>
            <p *ngIf="project.repository">
              <strong>Repository:</strong>
              <a [href]="project.repository" target="_blank" class="repo-link">
                <mat-icon>link</mat-icon>
                {{project.repository}}
              </a>
            </p>
            <p *ngIf="project.assignedUsers && project.assignedUsers.length > 0">
              <strong>Résztvevők:</strong>
              <span class="assigned-users">
                {{getAssignedUsersString(project)}}
              </span>
            </p>
          </mat-card-content>
          
          <mat-card-actions *ngIf="canModifyProject(project)">
            <button mat-button color="primary" 
                    *ngIf="authService.isAdmin()"
                    (click)="toggleProjectStatus(project)">
              {{project.isActive ? 'Deaktiválás' : 'Aktiválás'}}
            </button>
            <button mat-button color="warn" 
                    *ngIf="authService.isAdmin()"
                    (click)="deleteProject(project)">
              Törlés
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Táblázatos nézet -->
      <div class="table-container" *ngIf="currentView === 'table' && projects.length > 0">
        <table mat-table [dataSource]="projects" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Név</th>
            <td mat-cell *matCellDef="let project">{{project.name}}</td>
          </ng-container>

          <ng-container matColumnDef="projectManager">
            <th mat-header-cell *matHeaderCellDef>Projektvezető</th>
            <td mat-cell *matCellDef="let project">{{project.projectManager}}</td>
          </ng-container>

          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef>Kezdés</th>
            <td mat-cell *matCellDef="let project">{{project.startDate | date}}</td>
          </ng-container>

          <ng-container matColumnDef="plannedEndDate">
            <th mat-header-cell *matHeaderCellDef>Tervezett befejezés</th>
            <td mat-cell *matCellDef="let project">{{project.plannedEndDate | date}}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Státusz</th>
            <td mat-cell *matCellDef="let project">
              <span [class.status-active]="project.isActive" 
                    [class.status-inactive]="!project.isActive">
                {{project.isActive ? 'Aktív' : 'Inaktív'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Műveletek</th>
            <td mat-cell *matCellDef="let project">
              <button mat-icon-button color="primary" (click)="openProjectDetails(project)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="primary" 
                      *ngIf="authService.isAdmin()"
                      (click)="toggleProjectStatus(project)">
                <mat-icon>{{project.isActive ? 'pause' : 'play_arrow'}}</mat-icon>
              </button>
              <button mat-icon-button color="warn" 
                      *ngIf="authService.isAdmin()"
                      (click)="deleteProject(project)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      
      <ng-template #noProjects>
        <mat-card>
          <mat-card-content>
            <p>Nincsenek projektek. 
              <span *ngIf="!authService.isReader()">Kattints a fenti gombra új projekt létrehozásához.</span>
            </p>
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
    .header-controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .projects-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .table-container {
      margin-top: 20px;
    }
    table {
      width: 100%;
    }
    .project-card mat-card-content {
      cursor: pointer;
    }
    .status-active {
      color: #4CAF50;
      font-weight: 500;
    }
    .status-inactive {
      color: #F44336;
      font-weight: 500;
    }
    .repo-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: inherit;
      text-decoration: none;
    }
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 8px;
    }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  currentView: 'card' | 'table' = 'card';
  displayedColumns: string[] = ['name', 'projectManager', 'startDate', 'plannedEndDate', 'status', 'actions'];


  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    public authService: AuthService,
    private snackBar: MatSnackBar 
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }


  getAssignedUsersString(project: Project): string {
    if (!project.assignedUsers || project.assignedUsers.length === 0) {
      return '';
    }
    return project.assignedUsers.map(user => user.email).join(', ');
  }


  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  canModifyProject(project: Project): boolean {
    if (this.authService.isAdmin()) return true;
    if (this.authService.isDeveloper() && project.userId === this.authService.getCurrentUserId()) return true;
    return false;
  }

  openAddProjectDialog(): void {
    if (this.authService.isReader()) return;

    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        this.projectService.createProject(result).subscribe({
          next: (response) => {
            console.log('Project created successfully:', response);
            this.loadProjects();
            this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error creating project:', error);
            this.snackBar.open(error.message || 'Error creating project', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openProjectDetails(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDetailsDialogComponent, {
      width: '600px',
      data: {
        ...project,
        canModify: this.canModifyProject(project),
        isAdmin: this.authService.isAdmin()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result.action === 'toggle' && this.authService.isAdmin()) {
        this.projectService.toggleProjectStatus(result.project.id).subscribe({
          next: () => {
            this.loadProjects();
            this.snackBar.open('Project status updated', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error toggling project status:', error);
            this.snackBar.open('Error updating project status', 'Close', { duration: 3000 });
          }
        });
      } else if (result.action === 'save' && this.canModifyProject(project)) {
        this.projectService.updateProject(result.project).subscribe({
          next: () => {
            this.loadProjects();
            this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error updating project:', error);
            this.snackBar.open('Error updating project', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  toggleProjectStatus(project: Project): void {
    if (!this.authService.isAdmin()) return;

    if (project.id) {
      this.projectService.toggleProjectStatus(project.id).subscribe({
        next: () => {
          this.loadProjects();
          this.snackBar.open('Project status updated', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error toggling project status:', error);
          this.snackBar.open('Error updating project status', 'Close', { duration: 3000 });
        }
      });
    }
  }
  deleteProject(project: Project): void {
    if (!this.authService.isAdmin()) return;

    if (project.id && confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects();
          this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
