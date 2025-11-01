export interface AccountRequest {
  id: number;
  userId: number;
  requestType: 'CREATE' | 'DELETE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  accountNumber: string;
  accountType: string;
  initialBalance: number;
  createdAt: string;
}
