// Account Model
export interface Account {
  id?: number;
  accountNumber: string;
  type: string;
  balance: number;
  userId?: number;
}

export interface AccountCreateRequest {
  type: string;
  initialBalance: number;
}

export interface AccountOperationRequest {
  accountNumber: string;
  amount: number;
}
