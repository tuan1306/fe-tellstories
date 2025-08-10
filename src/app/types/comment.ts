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

export type CommentReply = {
  id: string;
  content: string;
  createdAt: string;
  displayName: string;
  avatarUrl?: string;
  storyTitle: string;
};

export type StatusFilter = "Pending" | "Resolved";

export type IssueType = "comment" | "bug" | "other";

export interface FlaggedComment {
  id: string;
  issueId: string;
  content: string;
  flaggedReason: string;
  createdAt: string;
  displayName: string;
  avatarUrl?: string;
  status: StatusFilter;
  type: IssueType;
  replies?: CommentReply[];
}

export type CommentSummary = {
  id: string;
  issueId: string;
  content: string;
  createdDate: string;
  displayName: string;
  flaggedReason?: string;
};

export type CommentDetail = {
  id: string;
  storyId: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  content: string;
  createdDate: string;
  flaggedReason?: string;
  storyTitle: string;
  replies?: CommentDetail[];
};
