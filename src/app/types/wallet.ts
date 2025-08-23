export type TransactionType = "Credit" | "Debit";

export interface WalletUser {
  id: string;
  displayName: string;
  avatarUrl: string;
}

export interface Wallet {
  userId: string;
  user: WalletUser;
  balance: number;
  isLocked: boolean;
}

export interface WalletTransaction {
  wallet: Wallet;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: TransactionType;
  description: string;
  referenceId: string | null;
  performedByUser: WalletUser | null;
}

export interface WalletTransactionResponse {
  currentPage: number;
  pageCount: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: WalletTransaction[];
}
