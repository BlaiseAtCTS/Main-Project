// User Model
import { Account } from './account.model';

export interface User {
  id?: number;
  userName: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;
  address?: string;
  role?: string;
}

export interface UserLoginRequest {
  userName: string;
  password: string;
}

export interface UserRegisterRequest {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  address: string;
}

export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  address: string;
  accounts: Account[];
}
