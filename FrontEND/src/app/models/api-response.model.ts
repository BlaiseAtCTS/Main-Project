// API Response Model
export interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: string;
  username?: string;
  data?: any;
  error?: string;      // Validation error type (e.g., "Validation Error", "Registration Failed")
  field?: string;      // Field name causing the error (e.g., "userName", "email")
}
