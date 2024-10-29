import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatCardModule } from '@angular/material/card';
import { ProjectService } from '../services/project.service';

interface CalendarEvent extends EventInput {
  title: string;
  start: Date | string;
  end?: Date | string;
  extendedProps?: {
    isActive: boolean;
    description?: string;
    manager?: string;
  };
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatCardModule
  ],
  template: `
    <div class="calendar-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Project Calendar</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <full-calendar [options]="calendarOptions"></full-calendar>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 20px;
    }

    ::ng-deep .fc {
      max-width: 1100px;
      margin: 0 auto;
    }

    ::ng-deep .fc-toolbar-title {
      font-size: 1.5em !important;
    }

    ::ng-deep .fc-event.active-project {
      background-color: #4CAF50;
      border-color: #388E3C;
    }

    ::ng-deep .fc-event.inactive-project {
      background-color: #9E9E9E;
      border-color: #757575;
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
    eventClassNames: (arg) => {
      return arg.event.extendedProps?.['isActive'] ? ['active-project'] : ['inactive-project'];
    }
  };

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      const events: CalendarEvent[] = projects.map(project => ({
        title: project.name,
        start: project.startDate,
        end: project.plannedEndDate,
        extendedProps: {
          isActive: project.isActive,
          description: project.description,
          manager: project.projectManager
        }
      }));

      this.calendarOptions.events = events;
    });
  }
}
