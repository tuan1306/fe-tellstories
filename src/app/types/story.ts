export type StoryDetails = {
  id: string;
  title: string;
  author: string | null;
  description: string;
  status: "Draft" | "Published" | "Archived" | null;
  coverImageUrl: string;
  language: "EN" | "VN" | null;
  duration: number;
  ageRange: "1-3" | "3-5" | "5-8" | "8-10" | "10+" | null;
  readingLevel: "Sơ cấp" | "Trung cấp" | "Nâng cao" | null;
  storyType: string;
  isAIGenerated: boolean;
  isDraft: boolean;
  backgroundMusicUrl: string;
  isFeatured: boolean;
  isCommunity: boolean;
  isPublished: boolean;
  createdDate: string;
  createdBy: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  updatedAt: string;
  updatedBy: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  panels: {
    content: string;
    imageUrl: string;
    audioUrl: string;
    isEndPanel: boolean;
    languageCode: string;
    panelNumber: number;
  }[];
  tags: {
    name: string;
    slug: string;
    description: string | null;
  }[];
};

export type StoryEditDetails = {
  id: string;
  title: string;
  author: string;
  description: string;
  isDraft: boolean;
  coverImageUrl: string;
  language: "ENG" | "VIE";
  duration: number;
  ageRange: "1-3" | "3-5" | "5-8" | "8-10" | "10+";
  readingLevel: "Sơ cấp" | "Trung cấp" | "Nâng cao";
  storyType: string;
  isAIGenerated: boolean;
  backgroundMusicUrl: string;
  panels: {
    content: string;
    imageUrl: string;
    audioUrl: string;
    isEndPanel: boolean;
    languageCode: string;
    panelNumber: number;
  }[];
  tags: {
    tagNames: string[];
  };
  isPublished?: boolean;
  isCommunity?: boolean;
  isFeatured?: boolean;
};

// User

export interface UserPublish {
  id: string;
  title: string;
  coverImageUrl: string;
  author: string;
}

export interface UserRecentPublish {
  id: string;
  title: string;
  coverImageUrl: string;
  ageRange: string;
}
