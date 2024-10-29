import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7294/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(user: { username: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}
