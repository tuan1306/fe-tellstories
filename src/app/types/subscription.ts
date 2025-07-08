export type SubscriptionPackage = {
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
