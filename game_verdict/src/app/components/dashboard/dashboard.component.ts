import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { User, UserService } from '../../services/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';


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

// interface UserWithBanStatus extends User {
// }

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
    SafeUrlPipe,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatMenuModule
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

  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'createdAt', 'lastLogin', 'currentRole', 'isBanned', 'actions'];
  roleOptions = ['ADMIN', 'MEMBER', 'REVIEWER' , 'MODERATOR'];

  roleControls: { [key: number]: FormControl } = {};

  availablePlatforms: string[] = ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox', 'Nintendo Switch', 'Mobile', 'VR'];
  availableGenres: string[] = ['Action', 'Adventure', 'RPG', 'FPS', 'Strategy', 'Sports', 'Puzzle', 'Horror', 'Simulation', 'Open World', 'Sand Box'];

  isEditing = false;
  isEditingGame = false;
  currentGameId: number | null = null;

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGames();
    this.loadUsers();
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

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
        users.forEach(user => {
          // console.log(user);
          this.roleControls[user.id] = new FormControl(user.role);
        });
      },
      error: (err) => this.showError('Failed to load users')
    });
  }

  updateRole(id: number, newRole: User['role']): void {
    this.userService.updateUserRole(id, { role: newRole }).subscribe({
      next: () => {
        this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: () => this.showError('Failed to update status')
    });
  }

  // updateRole(userId: number): void {
  //   const newRole = this.roleControls[userId].value;
  //   this.userService.updateUserRole(userId, newRole).subscribe({
  //     next: () => {
  //       this.snackBar.open('Role updated successfully', 'Close', { duration: 3000 });
  //       this.loadUsers();
  //     },
  //     error: () => this.showError('Failed to update role')
  //   });
  // }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: () => this.showError('Failed to delete user')
      });
    }
  }

  banUser(user: User): void {
    const newBanStatus = !user.banned;
    const action = newBanStatus ? 'ban' : 'unban';

    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.userService.updateUserStatus(user.id, newBanStatus).subscribe({
        next: () => {
          this.snackBar.open(`User ${action}ned successfully`, 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: () => this.showError(`Failed to ${action} user`)
      });
    }
  }

  getBanButtonText(user: User): string {
    return user.banned ? 'Unban' : 'Ban';
  }

  getBanButtonIcon(user: User): string {
    // console.log(user.banned, user.id);

    let checks = user.banned ? 'check_circle' : 'block';
    return checks;
  }

  getBanButtonColor(user: User): string {
    return user.banned ? 'primary' : 'warn';
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
