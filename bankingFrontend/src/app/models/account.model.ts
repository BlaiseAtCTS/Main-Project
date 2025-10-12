export interface Account {
  id?: number;
  accountNumber: string;
  balance: number;
  type: string;
  userId?: number;
}

export interface AccountCreateRequest {
  accountNumber: string;
  initialBalance: number;
  type: string;
}

export interface AccountOperationRequest {
  accountNumber: string;
  balance: number;
}
