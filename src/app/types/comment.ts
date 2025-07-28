export interface User {
  id: string;
  displayName: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  storyId: string;
  content: string;
  parentComment: Comment | null;
  replyTo: string | null;
  createdDate: string;
  updatedAt: string;
  isHidden: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  isFlagged: boolean;
}
