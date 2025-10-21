export interface UserProfile {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  occupation: string;
  address: string;
  accounts: Account[];
}

export interface Account {
  accountNumber: string;
  balance: number;
  type: string;
}
