import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="login-container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Bejelentkezés</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Felhasználónév</mat-label>
            <input matInput [(ngModel)]="username" name="username" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Jelszó</mat-label>
            <input matInput type="password" [(ngModel)]="password" name="password" required>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">Bejelentkezés</button>
          <p class="register-link">
            Nincs még fiókod? <a routerLink="/register">Regisztrálj itt</a>
          </p>
        </form>
      </mat-card-content>
    </mat-card>
  </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    mat-card {
      min-width: 300px;
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .register-link {
      margin-top: 16px;
      text-align: center;
    }
    a {
      color: #3f51b5;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    mat-card-header {
      justify-content: center;
      margin-bottom: 16px;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/projects']);
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
