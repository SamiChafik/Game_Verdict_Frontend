import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    MatIconModule
  ]
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  currentUser: any = null;

  constructor(
      public authService: AuthService,
      private userService: UserService,
      private router: Router,
      private snackBar: MatSnackBar,
      private dialog: MatDialog
    ) {}

    ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    if (this.authService.userUpdated$) {
      this.authService.userUpdated$.subscribe(() => {
        this.currentUser = this.authService.getUser();
      });
    }
  }

  openEditProfile(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '400px',
      data: { user: this.currentUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(this.currentUser.id, result).subscribe({
          next: (updatedUser) => {
            this.currentUser = updatedUser;
            this.snackBar.open('Profile updated successfully', 'Close', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Failed to update profile', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  logout() {
    this.authService.removeAuthData();
    this.snackBar.open('Déconnexion réussie', 'Fermer', { duration: 3000 });
    this.router.navigate(['/login']);
  }
}
