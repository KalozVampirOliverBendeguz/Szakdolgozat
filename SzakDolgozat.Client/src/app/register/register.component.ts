import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" [(ngModel)]="username" name="username" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
        </div>
        <div>
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" required>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Login here</a></p>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input {
      padding: 8px;
      margin-top: 5px;
    }
    button {
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
