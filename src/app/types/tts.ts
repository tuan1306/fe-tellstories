type ViettelTTSBody = {
  text: string;
  voiceID: string;
  speed: number;
  withoutFilter: boolean;
};

type PollinationTTSBody = {
  text: string;
  voiceId: string;
};

type FallbackTTSBody = {
  text: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TTSBody = ViettelTTSBody | PollinationTTSBody | FallbackTTSBody;
