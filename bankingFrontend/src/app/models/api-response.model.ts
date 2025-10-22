export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
  field?: string;
  token?: string;
  role?: string;
  data?: any;
}
