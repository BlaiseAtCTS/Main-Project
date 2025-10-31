import { inject } from '@angular/core';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { UserService } from '../services/user.service';
import { lastValueFrom } from 'rxjs';

/**
 * TanStack Query hook for fetching user profile
 */
export function useUserProfile() {
  const userService = inject(UserService);
  
  return injectQuery(() => ({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      console.log('🔄 Fetching user profile from API...');
      return await lastValueFrom(userService.getUserProfile());
    },
    staleTime: 1000 * 30, // 30 seconds - shorter stale time for fresher data
    refetchOnMount: 'always', // Always refetch when component mounts
  }));
}
