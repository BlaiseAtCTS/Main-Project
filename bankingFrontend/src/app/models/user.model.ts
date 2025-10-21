export interface User {
  id?: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
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
}

