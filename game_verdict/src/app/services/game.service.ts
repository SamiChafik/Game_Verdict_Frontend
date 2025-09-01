import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Game {
  id: number;
  title: string;
  description: string;
  link: string;
  releaseDate: string;
  platforms: string[];
  genres: string[];
  coverImg?: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface NewGame {
  title: string;
  description: string;
  link: string;
  releaseDate: Date;
  platforms: string[];
  genres: string[];
  coverImg?: string;
  averageRating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:8080/games';

  constructor(private http: HttpClient) { }

  getAllGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  addGame(game: NewGame): Observable<NewGame> {
    console.log(game)
    return this.http.post<NewGame>(this.apiUrl, game);
  }

  updateGame(id: number, game: NewGame): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/${id}`, game);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional methods
  getGamePlatforms(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${id}/platforms`);
  }

  getGameGenres(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${id}/genres`);
  }

  getReviewCount(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/review-count`);
  }
}
