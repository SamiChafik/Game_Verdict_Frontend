import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GameService } from '../../services/game.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

interface Game {
  id: number;
  title: string;
  description: string;
  link: string;
  releaseDate: Date;
  platforms: string[];
  genres: string[];
  coverImg?: string;
  averageRating?: number;
  rawgId?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    SafeUrlPipe
  ]
})
export class DashboardComponent implements OnInit {
  games: Game[] = [];
  newGame: Game = {
    id: 0,
    title: '',
    description: '',
    link: '',
    releaseDate: new Date(),
    platforms: [],
    genres: []
  };

  availablePlatforms: string[] = ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox', 'Nintendo Switch', 'Mobile', 'VR'];
  availableGenres: string[] = ['Action', 'Adventure', 'RPG', 'FPS', 'Strategy', 'Sports', 'Puzzle', 'Horror', 'Simulation', 'Open World', 'Sand Box'];

  isEditing = false;
  isEditingGame = false;
  currentGameId: number | null = null;

  constructor(
    private gameService: GameService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe({
      next: (games) => {
        this.games = games.map(game => ({
          ...game,
          releaseDate: new Date(game.releaseDate)
        }));
      },
      error: (err) => {
        this.showError('Failed to load games');
      }
    });
  }

  onSubmitGame(): void {
    if (this.isEditingGame && this.currentGameId !== null) {
      this.gameService.updateGame(this.currentGameId, this.newGame).subscribe({
        next: () => {
          this.loadGames();
          this.resetGameForm();
          this.showSuccess('Game updated successfully');
        },
        error: (err) => {
          this.showError('Failed to update game');
        }
      });
    } else {
      this.gameService.addGame(this.newGame).subscribe({
        next: () => {
          this.loadGames();
          this.resetGameForm();
          this.showSuccess('Game created successfully');
        },
        error: (err) => {
          this.showError('Failed to create game');
        }
      });
    }
  }

  editGame(game: Game): void {
    this.isEditingGame = true;
    this.currentGameId = game.id;

    this.newGame = {
      ...game,
      releaseDate: new Date(game.releaseDate)
    };
  }

  deleteGame(id: number): void {
    if (confirm('Are you sure you want to delete this game?')) {
      this.gameService.deleteGame(id).subscribe({
        next: () => {
          this.loadGames();
          this.showSuccess('Game deleted successfully');
        },
        error: (err) => {
          this.showError('Failed to delete game');
        }
      });
    }
  }

  resetGameForm(): void {
    this.isEditingGame = false;
    this.currentGameId = null;
    this.newGame = {
      id: 0,
      title: '',
      description: '',
      link: '',
      releaseDate: new Date(),
      platforms: [],
      genres: []
    };
  }

  convertToEmbedUrl(url: string): string {
    if (!url) return '';

    // Check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // Handle YouTube watch URLs
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      let videoId = '';

      // Handle youtu.be short URLs
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      // Handle regular YouTube URLs
      else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Return original URL if it doesn't match YouTube patterns
    return url;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
