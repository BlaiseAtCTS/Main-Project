// Transaction Model
export interface Transaction {
  id?: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  type: string;
  timestamp?: string;
  description?: string;
}

export interface TransferRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
}

export interface GetTransactionsRequest {
  accountNumber: string;
}
