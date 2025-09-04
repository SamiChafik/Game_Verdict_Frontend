import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-banned',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <div class="banned-container">
      <mat-card class="banned-card">
        <mat-card-content>
          <h1>Account Banned</h1>
          <p>Your account has been suspended. Please contact support for more information.</p>
          <button mat-raised-button color="primary" (click)="logout()">Return to Login</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .banned-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .banned-card {
      max-width: 400px;
      text-align: center;
      padding: 2rem;
    }
    h1 {
      color: #f44336;
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 2rem;
      color: #666;
    }
  `]
})
export class BannedComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.removeAuthData();
    window.location.href = '/login';
  }
}
