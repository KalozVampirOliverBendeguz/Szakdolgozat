import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProjectService, Project } from '../services/project.service';
import { AuthService } from '../auth.service';

interface CalendarEvent extends EventInput {
  title: string;
  start: Date | string;
  end?: Date | string;
  extendedProps?: {
    isActive: boolean;
    description?: string;
    manager?: string;
    projectId: number;
  };
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatButtonToggleModule
  ],
  template: `
    <div class="calendar-container">
      <div class="calendar-layout">
        <!-- Szűrő panel -->
        <div class="filter-panel">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Szűrők</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <!-- Nézet választó -->
              <mat-button-toggle-group
                [(ngModel)]="selectedView"
                (change)="onViewChange()"
                class="view-toggle">
                <mat-button-toggle value="all">Összes projekt</mat-button-toggle>
                <mat-button-toggle value="my">Saját projektek</mat-button-toggle>
              </mat-button-toggle-group>

              <!-- Projekt választó -->
              <mat-form-field class="project-select">
                <mat-label>Projekt szűrő</mat-label>
                <mat-select [(ngModel)]="selectedProjectId" (selectionChange)="filterEvents()">
                  <mat-option [value]="null">Összes projekt</mat-option>
                  <mat-option *ngFor="let project of projects" [value]="project.id">
                    {{project.name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Naptár -->
        <div class="calendar-main">
          <mat-card>
            <mat-card-content>
              <full-calendar [options]="calendarOptions"></full-calendar>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 20px;
    }
    .calendar-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
    }
    .filter-panel {
      position: sticky;
      top: 84px;
    }
    .project-select {
      width: 100%;
      margin-top: 16px;
    }
    .view-toggle {
      width: 100%;
      margin-bottom: 16px;
    }
    ::ng-deep .fc-event {
      cursor: pointer;
      padding: 2px 5px;
    }
    ::ng-deep .fc-event.active-project {
      background-color: #4CAF50;
      border-color: #388E3C;
    }
    ::ng-deep .fc-event.inactive-project {
      background-color: #9E9E9E;
      border-color: #757575;
    }
    ::ng-deep .fc-event-title {
      font-weight: normal;
    }
  `]
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    events: [],
    eventDisplay: 'block',
    eventContent: (arg) => {
      return {
        html: `<div class="event-content">${arg.event.title}</div>`
      }
    },
    eventClassNames: (arg) => {
      return arg.event.extendedProps?.['isActive'] ? ['active-project'] : ['inactive-project'];
    }
  };

  projects: Project[] = [];
  allEvents: CalendarEvent[] = [];
  selectedProjectId: number | null = null;
  selectedView: 'all' | 'my' = 'all';

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.allEvents = projects.map(project => ({
        title: project.name,
        start: project.startDate,
        end: project.plannedEndDate,
        extendedProps: {
          isActive: project.isActive,
          description: project.description,
          manager: project.projectManager,
          projectId: project.id!
        }
      }));
      this.filterEvents();
    });
  }

  onViewChange() {
    this.filterEvents();
  }

  filterEvents() {
    let filteredEvents = [...this.allEvents];

    // Szűrés nézet alapján
    if (this.selectedView === 'my') {
      const currentUserId = this.authService.getCurrentUserId();
      const userProjects = this.projects.filter(p =>
        p.userId === currentUserId ||
        p.assignedUsers?.some(u => u.id === currentUserId)
      );
      const userProjectIds = userProjects.map(p => p.id);
      filteredEvents = filteredEvents.filter(event =>
        userProjectIds.includes(event.extendedProps?.projectId)
      );
    }

    // Szűrés projekt alapján
    if (this.selectedProjectId) {
      filteredEvents = filteredEvents.filter(event =>
        event.extendedProps?.projectId === this.selectedProjectId
      );
    }

    // Események frissítése a naptárban
    this.calendarOptions.events = filteredEvents;
  }
}
