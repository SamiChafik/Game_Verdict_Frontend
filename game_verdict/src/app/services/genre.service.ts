import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface genres {
  id: number;
  name: string;
}

interface newGenre {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private apiUrl = 'http://localhost:8080/genres';

    constructor(private http: HttpClient) { }

    getAllGenres(): Observable<genres[]> {
      return this.http.get<genres[]>(this.apiUrl);
    }

    getGenreById(id: number): Observable<genres> {
      return this.http.get<genres>(`${this.apiUrl}/${id}`);
    }

    createGenre(Genre: newGenre): Observable<newGenre> {
      return this.http.post<newGenre>(this.apiUrl, Genre);
    }

    updateGenre(id: number, platform: genres): Observable<genres> {
      return this.http.put<genres>(`${this.apiUrl}/${id}`, platform);
    }

    deleteGenre(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
