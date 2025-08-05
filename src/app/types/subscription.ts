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

export type DashboardData = {
  subscriptionRevenue: number;
  subscriptionRevenueFluct: number | null;
  subscriber: number;
  subscriberFluct: number | null;
  newSubscriber: number;
  newSubscriberFluct: number | null;
  quittedSubscriber: number;
  quittedSubscriberFluct: number | null;
  subscriberBySubscriptionsFluct: number | null;
  recentSubscribers: {
    user: {
      id: string;
      displayName: string;
      avatarUrl: string;
    };
    subscriptionName: string;
  }[];
  subscriberBySubscriptions: {
    subscriptionName: string;
    numberOfSubscriber: number;
  }[];
  mostPopularTier: {
    percentage: number;
    subscriptionName: string;
    numberOfSubscriber: number;
  };
};

export type RecentSubscriber = {
  user: {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
  subscriptionName: string;
};

export type SubscriberBySubscriptions = {
  subscriptionName: string;
  numberOfSubscriber: number;
};
