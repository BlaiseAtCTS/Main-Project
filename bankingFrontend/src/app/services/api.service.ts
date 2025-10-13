import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { UserLoginRequest, UserRegisterRequest } from '../models/user.model';
import { UserProfile } from '../models/user-profile.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(private router: Router, private storage: StorageService, private ngZone: NgZone) {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      withCredentials: true, // Important for CORS with credentials
    });

    // Add request interceptor to inject JWT token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.storage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Ensure response handling runs inside Angular zone so change detection triggers
        return this.ngZone.run(() => response);
      },
      (error) => {
        return this.ngZone.run(() => {
          if (error.response?.status === 401) {
            // Handle unauthorized access
            this.storage.removeItem('token');
            this.router.navigate(['/login']);
          }
          return Promise.reject(error);
        });
      }
    );
  }

  // Auth endpoints
  async login(userName: string, password: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>('/user/login', {
        userName,
        password,
      });
      const apiResponse = response.data;
      if (apiResponse.success && apiResponse.token) {
        this.storage.setItem('token', apiResponse.token);
      }
      return apiResponse;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      return {
        success: false,
        message: 'An error occurred during login',
        error: error.message,
      };
    }
  }

  async register(userData: any): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>('/user/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      return {
        success: false,
        message: error.message || 'An error occurred during registration',
      };
    }
  }

  // Account endpoints
  async createAccount(accountData: any): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>('/account/create', accountData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      return {
        success: false,
        message: error.message || 'An error occurred while creating account',
      };
    }
  }

  async getAccounts() {
    return await this.axiosInstance.get('/account/list');
  }

  async getAccountBalance(accountNumber: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>('/account/balance', {
        accountNumber,
        amount: 0,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      return {
        success: false,
        message: error.message || 'An error occurred while getting balance',
      };
    }
  }

  // Transaction endpoints
  async deposit(accountNumber: string, amount: number): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>('/account/deposit', {
        accountNumber,
        amount,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      return {
        success: false,
        message: error.message || 'An error occurred while making deposit',
      };
    }
  }

  async withdraw(accountNumber: string, amount: number): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>('/account/withdraw', {
        accountNumber,
        amount,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      return {
        success: false,
        message: error.message || 'An error occurred while making withdrawal',
      };
    }
  }

  async getTransactions(accountNumber: string) {
    return await this.axiosInstance.get(`/account/transactions/${accountNumber}`);
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      const token = this.storage.getItem('token');
      console.debug('[ApiService] getUserProfile - token present?', !!token);
      const response = await this.axiosInstance.get<UserProfile>('/api/profile');
      console.debug('[ApiService] getUserProfile response:', response?.data);
      return response.data;
    } catch (error: any) {
      console.error('[ApiService] getUserProfile error:', error?.response || error);
      throw error;
    }
  }

  async deleteAccount(accountNumber: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>('/account/delete', {
        accountNumber,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      return {
        success: false,
        message: error.message || 'An error occurred while deleting account',
      };
    }
  }
}
