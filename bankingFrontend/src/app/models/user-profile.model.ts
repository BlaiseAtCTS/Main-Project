export interface UserProfile {
  firstName: string;
  lastName: string;
  userName: string;
  accounts: Account[];
}

export interface Account {
  accountNumber: string;
  balance: number;
  type: string;
}
