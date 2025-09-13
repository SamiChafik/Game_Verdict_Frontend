import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { GameService, Game } from '../../services/game.service';
import { FavoriteGameService } from '../../services/favorite-game.service';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { CommentService } from '../../services/comment.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

import { Review } from '../../models/review.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafeUrlPipe
  ],
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  isPopupVisible = false;
  selectedGame: Game | null = null;
  reviews: Review[] = [];
  newReviewContent = '';
  newReviewRating = 'FIVE_STAR';
  rating = 5;
  newComment: { [reviewId: number]: string } = {};

  setRating(rating: number): void {
    this.rating = rating;
    const ratings = ['ONE_STAR', 'TWO_STAR', 'THREE_STAR', 'FOUR_STAR', 'FIVE_STAR'];
    this.newReviewRating = ratings[rating - 1];
  }
  private authSubscription: Subscription = new Subscription();

  constructor(
    private gameService: GameService,
    private favoriteGameService: FavoriteGameService,
    public authService: AuthService,
    private reviewService: ReviewService,
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGames();
    this.authSubscription = this.authService.userUpdated$.subscribe(() => {
      this.loadGames();
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe({
      next: (games) => {
        this.games = games.map(game => ({
          ...game,
          releaseDate: new Date(game.releaseDate),
          isFavorite: false
        }));
        this.checkFavorites();
      },
      error: (err) => {
        this.showError('Failed to load games');
      }
    });
  }

  checkFavorites(): void {
    if (!this.authService.isAuthenticated()) return;

    this.favoriteGameService.getUserFavorites().subscribe({
      next: (favorites) => {
        const favoriteGameIds = favorites.map(fav => fav.id);
        this.games = this.games.map(game => ({
          ...game,
          isFavorite: favoriteGameIds.includes(game.id)
        }));
      },
      error: (err) => {
        console.error('Failed to load favorites', err);
      }
    });
  }

  toggleFavorite(game: Game): void {
    if (!this.authService.isAuthenticated()) {
      this.showError('Please log in to add favorites');
      return;
    }

    if (game.isFavorite) {
      this.favoriteGameService.removeFavorite(game.id).subscribe({
        next: () => {
          game.isFavorite = false;
          this.showSuccess('Removed from favorites');
        },
        error: (err) => {
          this.showError('Failed to remove from favorites');
        }
      });
    } else {
      this.favoriteGameService.addFavorite(game.id).subscribe({
        next: () => {
          game.isFavorite = true;
          this.showSuccess('Added to favorites');
        },
        error: (err) => {
          this.showError('Failed to add to favorites');
        }
      });
    }
  }

  openPopup(game: Game): void {
    this.selectedGame = game;
    this.isPopupVisible = true;
    this.loadReviews(game.id);
  }

  closePopup(): void {
    this.isPopupVisible = false;
    this.selectedGame = null;
    this.reviews = [];
    this.newReviewContent = '';
  }

  loadReviews(gameId: number): void {
    this.reviewService.getReviewsByGame(gameId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.reviews.forEach(review => this.loadComments(review.id));
      },
      error: (err) => {
        this.showError('Failed to load reviews');
      }
    });
  }

  submitReview(): void {
    if (!this.newReviewContent.trim() || !this.selectedGame) {
      return;
    }

    const currentUser = this.authService.getUser();
    if (!currentUser) {
      this.showError('You must be logged in to write a review.');
      return;
    }

    const newReview: Partial<Review> = {
      content: this.newReviewContent,
      gameId: this.selectedGame.id,
      reviewerId: currentUser.id,
      rating: this.newReviewRating
    };

    this.reviewService.createReview(newReview).subscribe({
      next: (review) => {
        this.reviews.push(review);
        this.newReviewContent = '';
        this.showSuccess('Review submitted successfully');
      },
      error: (err) => {
        this.showError('Failed to submit review');
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(review => review.id !== reviewId);
        this.showSuccess('Review deleted successfully');
      },
      error: (err) => {
        this.showError(err.error.message || 'Failed to delete review');
      }
    });
  }

  canDeleteReview(review: Review): boolean {
    const currentUser = this.authService.getUser();
    if (!currentUser) {
      return false;
    }
    const isOwner = review.reviewerId === currentUser.id;
    const isAdmin = currentUser.role === 'ADMIN';
    const isModerator = currentUser.role === 'MODERATOR';
    return isOwner || isAdmin || isModerator;
  }

  getStarRating(rating: string): number {
    const ratings = {
      'ONE_STAR': 1,
      'TWO_STAR': 2,
      'THREE_STAR': 3,
      'FOUR_STAR': 4,
      'FIVE_STAR': 5
    };
    return ratings[rating as keyof typeof ratings] || 0;
  }

  getAverageRatingStars(averageRating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push('fas fa-star');
    }

    if (halfStar) {
      stars.push('fas fa-star-half-alt');
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push('far fa-star');
    }

    return stars;
  }

  isReviewer(): boolean {
    const currentUser = this.authService.getUser();
    return currentUser && currentUser.role === 'REVIEWER';
  }

  convertToEmbedUrl(url: string): string {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }

  loadComments(reviewId: number): void {
    this.commentService.getCommentsByReview(reviewId).subscribe({
      next: (comments) => {
        console.log(comments);
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.comments = comments;
        }
      },
      error: (err) => {
        this.showError('Failed to load comments');
      }
    });
  }

  submitComment(reviewId: number): void {
    const content = this.newComment[reviewId];
    if (!content || !content.trim()) {
      return;
    }

    const currentUser = this.authService.getUser();
    if (!currentUser) {
      this.showError('You must be logged in to comment.');
      return;
    }

    const newComment: Partial<Comment> = {
      content: content,
      reviewId: reviewId,
      userId: currentUser.id
    };

    this.commentService.createComment(newComment).subscribe({
      next: (comment) => {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          if (!review.comments) {
            review.comments = [];
          }
          review.comments.push(comment);
        }
        this.newComment[reviewId] = '';
        this.showSuccess('Comment submitted successfully');
      },
      error: (err) => {
        this.showError('Failed to submit comment');
      }
    });
  }

  canDeleteComment(comment: Comment): boolean {
    const currentUser = this.authService.getUser();
    if (!currentUser) {
      return false;
    }
    const isOwner = comment.userId === currentUser.id;
    const isAdmin = currentUser.role === 'ADMIN';
    const isModerator = currentUser.role === 'MODERATOR';
    return isOwner || isAdmin || isModerator;
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.reviews.forEach(review => {
          if (review.comments) {
            review.comments = review.comments.filter(comment => comment.id !== commentId);
          }
        });
        this.showSuccess('Comment deleted successfully');
      },
      error: (err) => {
        this.showError(err.error.message || 'Failed to delete comment');
      }
    });
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
