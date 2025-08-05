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

interface Platform {
  id: number;
  name: string;
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
    MatSnackBarModule
  ]
})
export class DashboardComponent implements OnInit {
  platforms: Platform[] = [];
  newPlatform: Platform = { id: 0, name: '' };
  isEditing = false;
  currentPlatformId: number | null = null;

  constructor(
    private platformService: PlatformService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPlatforms();
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

  onSubmit(): void {
    if (this.isEditing && this.currentPlatformId !== null) {
      this.platformService.updatePlatform(this.currentPlatformId, this.newPlatform).subscribe({
        next: () => {
          this.loadPlatforms();
          this.resetForm();
          this.showSuccess('Platform updated successfully');
        },
        error: (err) => {
          this.showError('Failed to update platform');
        }
      });
    } else {
      this.platformService.createPlatform(this.newPlatform).subscribe({
        next: () => {
          this.loadPlatforms();
          this.resetForm();
          this.showSuccess('Platform created successfully');
        },
        error: (err) => {
          this.showError('Failed to create platform');
        }
      });
    }
  }

  editPlatform(platform: Platform): void {
    this.isEditing = true;
    this.currentPlatformId = platform.id;
    this.newPlatform = { ...platform };
  }

  deletePlatform(id: number): void {
    if (confirm('Are you sure you want to delete this platform?')) {
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

  resetForm(): void {
    this.isEditing = false;
    this.currentPlatformId = null;
    this.newPlatform = { id: 0, name: '' };
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
