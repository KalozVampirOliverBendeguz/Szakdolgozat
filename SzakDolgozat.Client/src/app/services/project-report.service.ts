// project-report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectReport {
  id?: number;
  projectId: number;
  title: string;
  content: string;
  reportType: string;
  createdAt?: Date;
  createdBy?: {
    userName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjectReportService {
  private apiUrl = 'https://localhost:7294/api/ProjectReport';

  constructor(private http: HttpClient) { }

  createReport(report: ProjectReport): Observable<ProjectReport> {
    return this.http.post<ProjectReport>(this.apiUrl, {
      projectId: report.projectId,
      title: report.title,
      content: report.content,
      reportType: report.reportType
    });
  }

  getProjectReports(projectId: number): Observable<ProjectReport[]> {
    return this.http.get<ProjectReport[]>(`${this.apiUrl}/project/${projectId}`);
  }
}
