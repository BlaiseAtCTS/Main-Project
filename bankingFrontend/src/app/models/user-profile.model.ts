export interface UserProfile {
  firstName: string;
  lastName: string;
  userName: string;
  email: string | null;
  phoneNumber: number | null;
  dob: string | null;
  address: string | null;
  accounts: Account[];
}

export interface Account {
  accountNumber: string;
  balance: number;
  type: string;
}
