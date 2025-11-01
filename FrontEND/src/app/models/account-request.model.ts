export interface AccountRequest {
  id: number;
  userId: number;
  requestType: 'CREATE' | 'DELETE';
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  accountNumber: string;
  accountType: string;
  initialBalance: number;
  createdAt: string;
}
