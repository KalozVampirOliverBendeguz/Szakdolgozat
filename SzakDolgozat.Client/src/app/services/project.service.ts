import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Project {
  id?: number;
  name: string;
  projectManager: string;
  startDate: Date;
  plannedEndDate: Date;
  description?: string;
  isActive: boolean;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7294/api/project';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project).pipe(
      catchError(this.handleError)
    );
  }

  toggleProjectStatus(id: number): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}/toggle-status`, {}).pipe(
      catchError(this.handleError)
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.status === 401) {
      console.error('Unauthorized access. Please log in again.');
      // Opcionálisan: átirányítás a login oldalra
      // window.location.href = '/login';
    }
    return throwError(() => error);
  }
}
