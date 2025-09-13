
import { User } from './user.model';

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  reviewId: number;
  userId: number;
  username: string;
}
