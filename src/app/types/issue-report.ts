export interface ReportedUser {
  id: string;
  displayName: string;
  avatarUrl: string;
}

export interface TargetComment {
  id: string;
  userId: string;
  user: ReportedUser;
  storyId: string;
  content: string;
  parentComment: string | null;
  replyTo: string | null;
  createdDate: string;
  updatedAt: string;
  isHidden: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  isFlagged: boolean;
}

export type IssueType =
  | "Harassment"
  | "Toxic Behavior"
  | "Spam"
  | "Bug"
  | string;

export type TargetType = "Comment" | "Story" | "Bug" | string;

export type ReportStatus =
  | "Pending"
  | "Deleted"
  | "Dismissed"
  | "Resolved"
  | "null"
  | string
  | null;

export interface IssueReportItem {
  id: string;
  user: ReportedUser;
  issueType: IssueType;
  targetType: TargetType;
  targetId: string | null;
  targetObj: TargetComment | null;
  attachment: string | null;
  description: string | null;
  status: ReportStatus;
  createdDate: string;
}

export interface IssueReportResponse {
  success: boolean;
  data: {
    currentPage: number;
    pageCount: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: IssueReportItem[];
  };
  message: string;
  errors: string[];
}
export interface BugIssue {
  id: string;
  issueId: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
  issueType: string;
  targetType: string;
  attachment: string | null;
  description: string | null;
  status: string;
  createdDate: string;
}
