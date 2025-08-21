export type UserInfo = {
  id: string;
  displayName: string;
  avatarUrl: string;
};

export type SubscriptionInfo = {
  id: string;
  name: string;
  price: number;
  type: string;
  rewardPoints: number;
  durationDays: number;
  isActive: boolean;
  pointsCost: number;
  purchaseMethod: string;
};

export type BillingHistoryItem = {
  billingId: string;
  userId: string;
  user: UserInfo;
  subscriptionId: string;
  subscription: SubscriptionInfo;
  subtotal: number;
  discountAmount: number;
  total: number;
  paidAt: string | null;
  paymentMethod: string;
  paymentGateway: string;
  transactionId: string;
  status: string;
  invoiceUrl: string | null;
  notes: string;
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
