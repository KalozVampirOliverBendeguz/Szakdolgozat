import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <div class="content-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .content-container {
      padding-top: 64px; 
      padding: 84px 20px 20px 20px;
    }
  `]
})
export class AppComponent { }
