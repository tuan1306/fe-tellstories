export type BillingHistory = {
  id: string;
  paidAt: string;
  paymentMethod: string;
  status: string;
  subscriptionId: string;
  plan: string;
  price: number;
};

export type BillingResponse = {
  data: {
    userName: string;
    email: string;
    remainSubscriptionDays: number;
    totalMoneySpent: number;
    subscriptionName: string;
    subscriptionPrice: number;
    subscriptionDurationDays: number;
    subscriptionEndDate: string;
    billingHistory: BillingHistory[];
  };
};
