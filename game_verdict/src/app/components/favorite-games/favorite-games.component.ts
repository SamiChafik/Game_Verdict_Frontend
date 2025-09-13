import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteGameService } from '../../services/favorite-game.service';
import { Game } from '../../services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-favorite-games',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './favorite-games.component.html',
  styleUrls: ['./favorite-games.component.scss']
})
export class FavoriteGamesComponent implements OnInit {
  favoriteGames: Game[] = [];

  constructor(
    private favoriteGameService: FavoriteGameService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteGameService.getUserFavorites().subscribe(games => {
      this.favoriteGames = games;
    });
  }

  removeFavorite(gameId: number): void {
    this.favoriteGameService.removeFavorite(gameId).subscribe({
      next: () => {
        this.favoriteGames = this.favoriteGames.filter(game => game.id !== gameId);
        this.snackBar.open('Removed from favorites', 'Close', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Failed to remove from favorites', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}