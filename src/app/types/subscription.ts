export type SubscriptionPackage = {
  id: string;
  name: string;
  price: number;
  type: string;
  durationDays: number;
  billingCycle: number;
  maxStories: number;
  maxAIRequest: number;
  maxTTSRequest: number;
  isActive: boolean;
  isDefault: boolean;
};

export type RecentSubscriber = {
  user: {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
  subscriptionName: string;
};
