
import { Comment } from './comment.model';

export interface Review {
  id: number;
  content: string;
  rating: string;
  createdAt: Date;
  gameId: number;
  reviewerId: number;
  reviewerUsername: string;
  comments?: Comment[];
}
