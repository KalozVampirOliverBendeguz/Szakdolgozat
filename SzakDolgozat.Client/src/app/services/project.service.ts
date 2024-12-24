import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from './user.service';

export interface Project {
  id?: number;
  name: string;
  projectManager: string;
  startDate: Date | string;
  plannedEndDate: Date | string;
  description?: string;
  isActive: boolean;
  userId?: string;
  repository?: string;
  createdById: string;
  assignedUsers?: User[];
  projectUsers?: { userId: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7294/api/project';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createProject(projectData: Partial<Project>): Observable<Project> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user ID found'));
    }

    const projectToSend = {
      name: projectData.name,
      projectManager: projectData.projectManager,
      startDate: new Date(projectData.startDate!).toISOString(),
      plannedEndDate: new Date(projectData.plannedEndDate!).toISOString(),
      description: projectData.description,
      repository: projectData.repository,
      userId: userId,                 
      createdById: userId,           
      isActive: true,
      projectUsers: (projectData.assignedUsers || []).map(user => ({
        userId: user.id
      }))
    };

    console.log('Project data to send:', projectToSend);

    return this.http.post<Project>(this.apiUrl, projectToSend).pipe(
      tap(response => console.log('Project created successfully:', response)),
      catchError(error => {
        console.error('Error response:', error);
        const message = error.error?.message || error.error?.errors?.UserId || 'Error creating project';
        return throwError(() => new Error(message));
      })
    );
  }

  updateProject(project: Project): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user ID found'));
    }

    const projectToSend = {
      id: project.id,
      name: project.name,
      projectManager: project.projectManager,
      startDate: project.startDate,
      plannedEndDate: project.plannedEndDate,
      description: project.description,
      repository: project.repository,
      isActive: project.isActive,
      userId: userId,                
      createdById: userId,           
      projectUsers: (project.assignedUsers || []).map(user => ({
        userId: user.id
      }))
    };

    return this.http.put(`${this.apiUrl}/${project.id}`, projectToSend).pipe(
      catchError(error => {
        console.error('Error updating project:', error);
        const message = error.error?.message || 'Error updating project';
        return throwError(() => new Error(message));
      })
    );
  }

  toggleProjectStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle-status`, {}).pipe(
      catchError(this.handleError)
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}
