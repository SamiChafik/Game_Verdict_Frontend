import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Game } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteGameService {
  private apiUrl = 'http://localhost:8080/favorites';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserFavorites(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/user`, {
      headers: this.getHeaders()
    });
  }

  addFavorite(gameId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${gameId}`, {}, {
      headers: this.getHeaders()
    });
  }

  removeFavorite(gameId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/game/${gameId}`, {
      headers: this.getHeaders()
    });
  }

  checkFavorite(gameId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/game/${gameId}`, {
      headers: this.getHeaders()
    });
  }
}
