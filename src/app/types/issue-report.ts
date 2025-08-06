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

export interface IssueReportItem {
  id: string;
  user: ReportedUser;
  issueType: string;
  targetType: string;
  targetId: string | null;
  targetObj: TargetComment | null;
  attachment: string | null;
  description: string | null;
  status: string | null;
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
