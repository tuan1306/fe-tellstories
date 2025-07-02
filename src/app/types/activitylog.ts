export interface ActivityLog {
  id: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  targetType: string;
  action: "Comment" | "Rating" | "System" | string;
  timestamp: string;
  details: string;
  category: string;
  targetId: string;
  reason: string;
  actorRole: "User" | "Admin" | string;
  deviceInfo: string;
}
