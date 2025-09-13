import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GameService, Game } from '../../services/game.service';
import { FavoriteGameService } from '../../services/favorite-game.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  recentGames: Game[] = [];
  recentFavoriteGames: Game[] = [];

  constructor(
    private gameService: GameService,
    private favoriteGameService: FavoriteGameService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadRecentGames();
    if (this.authService.isAuthenticated()) {
      this.loadRecentFavoriteGames();
    }
  }

  loadRecentGames(): void {
    this.gameService.getRecentGames(3).subscribe({
      next: (games) => {
        this.recentGames = games;
      },
      error: (err) => {
        console.error('Failed to load recent games', err);
      }
    });
  }

  loadRecentFavoriteGames(): void {
    this.favoriteGameService.getUserFavorites().subscribe({
      next: (favorites) => {
        this.recentFavoriteGames = favorites.slice(0, 3);
      },
      error: (err) => {
        console.error('Failed to load recent favorite games', err);
      }
    });
  }
}
