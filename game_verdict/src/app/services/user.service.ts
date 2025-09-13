import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  bio: string;
  createdAt: string;
  lastLogin: string;
  role: string;
  banned: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/userList`);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/updateUser/${id}`, user);
  }

  updateUserRole(id: number, user: Partial<User>): Observable<User> {
    console.log(id, user);
    return this.http.put<User>(`${this.apiUrl}/updateRole/${id}`, user);
  }

  updateUserStatus(id: number, banned: boolean): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/updateStatus/${id}`, banned);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUser/${id}`);
  }

  deleteCurrentUser(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`);
  }
}