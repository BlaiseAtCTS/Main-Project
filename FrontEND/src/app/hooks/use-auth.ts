import { inject } from '@angular/core';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { AuthService } from '../services/auth.service';
import { UserLoginRequest, UserRegisterRequest } from '../models/user.model';
import { lastValueFrom } from 'rxjs';

/**
 * TanStack Query hook for user login
 */
export function useLogin() {
  const authService = inject(AuthService);
  
  return injectMutation(() => ({
    mutationKey: ['login'],
    mutationFn: async (data: UserLoginRequest) => {
      return await lastValueFrom(authService.login(data));
    },
    onSuccess: (response) => {
      if (response.success && response.token) {
        // Token is already stored in the auth service
        console.log('Login successful');
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    }
  }));
}

/**
 * TanStack Query hook for user registration
 */
export function useRegister() {
  const authService = inject(AuthService);
  
  return injectMutation(() => ({
    mutationKey: ['register'],
    mutationFn: async (data: UserRegisterRequest) => {
      return await lastValueFrom(authService.register(data));
    },
    onSuccess: (response) => {
      console.log('Registration successful:', response);
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    }
  }));
}

/**
 * TanStack Query hook for user logout
 */
export function useLogout() {
  const authService = inject(AuthService);
  
  return injectMutation(() => ({
    mutationKey: ['logout'],
    mutationFn: async () => {
      authService.logout();
      return { success: true };
    }
  }));
}

/**
 * Query hook to check authentication status
 */
export function useAuth() {
  const authService = inject(AuthService);
  
  return injectQuery(() => ({
    queryKey: ['auth', 'status'],
    queryFn: async () => {
      return {
        isAuthenticated: authService.isAuthenticated(),
        isAdmin: authService.isAdmin(),
        role: authService.getRole(),
        token: authService.getToken()
      };
    },
    staleTime: 1000 * 60, // 1 minute
  }));
}
