// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="home-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to SzakDolgozat</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Select an option from the navigation bar above to get started.</p>
        </mat-card-content>
      </mat-card>

      <div class="floating-calendar">
        <mat-card>
          <mat-calendar [selected]="selectedDate"></mat-calendar>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      position: relative;
      min-height: 80vh;
    }
    
    .floating-calendar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    .floating-calendar mat-calendar {
      transform: scale(0.8);
      transform-origin: bottom right;
    }
  `]
})
export class HomeComponent {
  selectedDate: Date = new Date();
}
