export interface User {
  id?: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number | null;
  dob: Date | null;
  address: string;
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
  phoneNumber: number | null;
  dob: Date | null;
  address: string;
}

