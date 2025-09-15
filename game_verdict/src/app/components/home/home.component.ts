import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GameService, Game } from '../../services/game.service';
import { FavoriteGameService } from '../../services/favorite-game.service';
import { AuthService } from '../../services/auth.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    DatePipe,
    SafeUrlPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  recentGames: Game[] = [];
  recentFavoriteGames: Game[] = [];
  // favGame: number = this.loadRecentFavoriteGames.length();

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
        favGame: number = favorites.filter(favorit => favorit).length()
      },
      error: (err) => {
        console.error('Failed to load recent favorite games', err);
      }
    });
  }

  convertToEmbedUrl(url: string): string {
    if (!url) return '';

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match) {
      const videoId = match[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return '';
  }
}
