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
  pointsCost: number;
  purchaseMethod: "MoneyOnly" | "PointsOnly" | "MoneyOrPoints";
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
  quitSubscriber: number;
  quitSubscriberFluct: number | null;
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

export interface SubscriptionDetail {
  user: string;
  plan: string;
  price: number;
  duration: number;
  subscribedOn: string;
  originalEndDate: string | null;
  expiriesOn: string;
  dayRemaining: number;
}
