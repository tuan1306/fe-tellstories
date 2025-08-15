export type BillingHistoryItem = {
  id: string;
  paidAt: string | null;
  paymentMethod: string;
  status: string;
  subscriptionId: string;
  plan: string;
  price: number;
};

export type PaginatedBillingHistory = {
  currentPage: number;
  pageCount: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: BillingHistoryItem[];
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
    billingHistory: PaginatedBillingHistory;
  };
};
