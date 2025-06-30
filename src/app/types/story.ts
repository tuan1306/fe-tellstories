export type StoryDetails = {
  id: string;
  title: string;
  author: string | null;
  description: string;
  status: string | null;
  coverImageUrl: string;
  language: string;
  duration: number;
  ageRange: string;
  readingLevel: string;
  storyType: string;
  isAIGenerated: boolean;
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
