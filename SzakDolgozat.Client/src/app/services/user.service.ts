import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserRole } from '../auth.service';

export interface User {
  id: string;
  userName: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7294/api/user';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<User[]>(this.apiUrl, { headers }).pipe(
      tap(users => console.log('Fetched users:', users)),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  updateUserRole(userId: string, role: UserRole): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.apiUrl}/${userId}/role`, { role }, { headers }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  searchUsers(query: string): Observable<User[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<User[]>(`${this.apiUrl}/search?query=${query}`, { headers }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  filterByRole(role: UserRole): Observable<User[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<User[]>(`${this.apiUrl}/filter?role=${role}`, { headers }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
