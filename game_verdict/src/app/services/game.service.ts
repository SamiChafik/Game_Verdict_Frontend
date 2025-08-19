import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface NewGame {
  title: string;
  description: string;
  link: string;
  releaseDate: Date;
  platforms: Platform[];
  genres: Genre[];
}

interface Game {
  id: number;
  title: string;
  description: string;
  link: string;
  releaseDate: Date;
  platforms: Platform[];
  genres: Genre[];
}

interface Platform {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
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

  addGame(Game: NewGame): Observable<NewGame> {
    return this.http.post<NewGame>(this.apiUrl, Game);
  }

  updateGame(id: number, game: Game): Observable<Game> {
        return this.http.put<Game>(`${this.apiUrl}/${id}`, game);
      }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
