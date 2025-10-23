// Account Request Model
export interface AccountRequest {
  id: number;
  userId: number;
  accountNumber: string;
  accountType: string;
  initialBalance?: number;
  requestType: string; // CREATE or DELETE
  status: string; // PENDING, APPROVED, DECLINED
  createdAt?: string;
}

export interface UserAccountData {
  username: string | null;
  phoneNumber: string | null;
  dob: string | null;
  email: string | null;
  address: string | null;
  accountType: string;
  accountNumber: string;
  balance: number | null;
}
