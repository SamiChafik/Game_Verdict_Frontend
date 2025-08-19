import { Component, OnInit } from '@angular/core';
import { PlatformService } from '../../services/platform.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GenreService } from '../../services/genre.service';
import { GameService } from '../../services/game.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

interface Platform {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
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
    SafeUrlPipe
  ]
})
export class DashboardComponent implements OnInit {
  platforms: Platform[] = [];
  newPlatform: Platform = { id: 0, name: '' };
  genres: Genre[] = [];
  newGenre: Genre = { id: 0, name: '' };
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

  isEditing = false;
  isEditingGame = false;
  currentPlatformId: number | null = null;
  currentGenreId: number | null = null;
  currentGameId: number | null = null;

  constructor(
    private platformService: PlatformService,
    private genreService: GenreService,
    private gameService: GameService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPlatforms();
    this.loadGenres();
    this.loadGames();
  }

  loadPlatforms(): void {
    this.platformService.getAllPlatforms().subscribe({
      next: (platforms) => {
        this.platforms = platforms;
      },
      error: (err) => {
        this.showError('Failed to load platforms');
      }
    });
  }

  loadGenres(): void {
    this.genreService.getAllGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
      error: (err) => {
        this.showError('Failed to load genres');
      }
    });
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe({
      next: (games) => {
        console.log(this.games);
        this.games = games;
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
      const gameToCreate = { title: this.newGame.title,
        description: this.newGame.description,
        link: this.newGame.link,
        releaseDate: this.newGame.releaseDate,
        platforms: this.newGame.platforms,
        genres: this.newGame.genres
      }
      this.gameService.addGame(gameToCreate).subscribe({
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

  onSubmitPlatform(): void {
    if (this.isEditing && this.currentPlatformId !== null) {
      this.platformService.updatePlatform(this.currentPlatformId, this.newPlatform).subscribe({
        next: () => {
          this.loadPlatforms();
          this.resetPlatformForm();
          this.showSuccess('Platform updated successfully');
        },
        error: (err) => {
          this.showError('Failed to update platform');
        }
      });
    } else {
      const platformToCreate = { name: this.newPlatform.name };

      this.platformService.createPlatform(platformToCreate).subscribe({
        next: () => {
          this.loadPlatforms();
          this.resetPlatformForm();
          this.showSuccess('Platform created successfully');
        },
        error: (err) => {
          this.showError('Failed to create platform');
        }
      });
    }

  }

  onSubmitGenre(): void {
    if (this.isEditing && this.currentGenreId !== null) {
      this.genreService.updateGenre(this.currentGenreId, this.newGenre).subscribe({
        next: () => {
          this.loadGenres();
          this.resetGenreForm();
          this.showSuccess('Genre updated successfully');
        },
        error: (err) => {
          this.showError('Failed to update Genre');
        }
      });
    } else {
      const genreToCreate = { name: this.newGenre.name };

      this.genreService.createGenre(genreToCreate).subscribe({
        next: () => {
          console.log(genreToCreate);
          this.loadGenres();
          this.resetGenreForm();
          this.showSuccess('Genre created successfully');
        },
        error: (err) => {
          this.showError('Failed to create Genre');
        }
      });
    }
  }

  editGame(game: Game): void {
    this.isEditingGame = true;
    this.currentGameId = game.id || null;
    this.newGame = {
      ...game,
      platforms: [...game.platforms],
      genres: [...game.genres]
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

  editPlatform(platform: Platform): void {
    this.isEditing = true;
    this.currentPlatformId = null;
    this.newPlatform = { ...platform };
  }

  editGenre(genre: Genre): void {
    this.isEditing = true;
    this.currentGenreId = null;
    this.newGenre = { ...genre };
  }

  deletePlatform(id: number): void {
    if (confirm('Are you sure you want to delete this platform ?')) {
      this.platformService.deletePlatform(id).subscribe({
        next: () => {
          this.loadPlatforms();
          this.showSuccess('Platform deleted successfully');
        },
        error: (err) => {
          this.showError('Failed to delete platform');
        }
      });
    }
  }

  deleteGenre(id: number): void {
    if (confirm('Are you sure you want to delete this Genre ?')) {
      this.genreService.deleteGenre(id).subscribe({
        next: () => {
          this.loadGenres();
          this.showSuccess('Genre deleted successfully');
        },
        error: (err) => {
          this.showError('Failed to delete Genre');
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

  resetPlatformForm(): void {
    this.isEditing = false;
    this.currentPlatformId = null;
    this.newPlatform = { id: 0,  name: '' };
  }

  resetGenreForm(): void {
    this.isEditing = false;
    this.currentGenreId = null;
    this.newGenre = { id: 0, name: '' };
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
        let url = `https://www.youtube.com/embed/${videoId}`;
        console.log(url);
        return url;
      }
    }

    // Return original URL if it doesn't match YouTube patterns
    return url;
  }

  test(): string {
    return 'https://www.youtube.com/embed/lWr6dhTcu-E';
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
