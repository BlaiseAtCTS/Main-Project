// API Response Model
export interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: string;
  data?: any;
}
