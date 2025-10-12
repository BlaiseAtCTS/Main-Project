export interface Transaction {
  id?: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  type: string;
  amount: number;
  timestamp?: string;
}

export interface TransferRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
}
