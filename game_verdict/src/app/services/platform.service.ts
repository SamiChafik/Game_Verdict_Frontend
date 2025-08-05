import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Platform {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private apiUrl = 'http://localhost:8080/platforms';

  constructor(private http: HttpClient) { }

  getAllPlatforms(): Observable<Platform[]> {
    return this.http.get<Platform[]>(this.apiUrl);
  }

  getPlatformById(id: number): Observable<Platform> {
    return this.http.get<Platform>(`${this.apiUrl}/${id}`);
  }

  createPlatform(platform: Platform): Observable<Platform> {
    return this.http.post<Platform>(this.apiUrl, platform);
  }

  updatePlatform(id: number, platform: Platform): Observable<Platform> {
    return this.http.put<Platform>(`${this.apiUrl}/${id}`, platform);
  }

  deletePlatform(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
