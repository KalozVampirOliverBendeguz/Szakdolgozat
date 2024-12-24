import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export enum UserRole {
  Admin = 1,
  Developer = 2,
  Reader = 3
}

interface RegisterResponse {
  token: string;
  role: UserRole;
  message: string;
}

interface LoginResponse {
  token: string;
  role: UserRole;
  message: string;
}

interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7294/api';
  private currentUserRole: UserRole | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserRole();
  }

  register(user: { username: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role.toString());
            this.currentUserRole = response.role;
          }
        }),
        catchError(this.handleError)
      );
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role.toString());
            this.currentUserRole = response.role;
          }
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.currentUserRole = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  }

  getCurrentUserRole(): UserRole {
    if (this.currentUserRole === null) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          this.currentUserRole = Number(role) as UserRole;
          console.log('Role from token:', role);
        } catch (error) {
          console.error('Error decoding role from token:', error);
          this.currentUserRole = UserRole.Reader;
        }
      } else {
        this.currentUserRole = UserRole.Reader;
      }
    }
    return this.currentUserRole;
  }

  isAdmin(): boolean {
    const currentRole = this.getCurrentUserRole();
    // console.log('Current role in isAdmin:', currentRole); 
    return currentRole === UserRole.Admin;
  }

  isDeveloper(): boolean {
    const role = this.getCurrentUserRole();
    return role === UserRole.Developer;
  }

  isReader(): boolean {
    const role = this.getCurrentUserRole();
    return role === UserRole.Reader;
  }

  getCurrentUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getCurrentUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }

  private loadUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const roleStr = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.currentUserRole = Number(roleStr) as UserRole;
      } catch (error) {
        console.error('Error loading user role:', error);
        this.currentUserRole = UserRole.Reader;
      }
    }
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}
