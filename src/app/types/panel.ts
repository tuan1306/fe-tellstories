export type StoryPanel = {
  content: string;
  imageUrl: string;
  audioUrl: string;
  isEndPanel: boolean;
  languageCode: string;
  panelNumber: number;
};

export type PanelSwiperProps = {
  panels: StoryPanel[];
  panelContents: string[];
  setPanelContents: (contents: string[]) => void;
};
