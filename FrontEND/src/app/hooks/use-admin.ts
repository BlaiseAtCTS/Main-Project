import { inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { AdminService } from '../services/admin.service';
import { lastValueFrom } from 'rxjs';

/**
 * TanStack Query hook for fetching pending requests
 */
export function usePendingRequests() {
  const adminService = inject(AdminService);
  
  return injectQuery(() => ({
    queryKey: ['admin', 'requests', 'pending'],
    queryFn: async () => {
      return await lastValueFrom(adminService.getPendingRequests());
    },
    staleTime: 1000 * 30, // 30 seconds
  }));
}

/**
 * TanStack Query hook for fetching create account requests
 */
export function useCreateRequests() {
  const adminService = inject(AdminService);
  
  return injectQuery(() => ({
    queryKey: ['admin', 'requests', 'create'],
    queryFn: async () => {
      return await lastValueFrom(adminService.getCreateRequests());
    },
    staleTime: 1000 * 30,
  }));
}

/**
 * TanStack Query hook for fetching delete account requests
 */
export function useDeleteRequests() {
  const adminService = inject(AdminService);
  
  return injectQuery(() => ({
    queryKey: ['admin', 'requests', 'delete'],
    queryFn: async () => {
      return await lastValueFrom(adminService.getDeleteRequests());
    },
    staleTime: 1000 * 30,
  }));
}

/**
 * TanStack Query hook for updating request status
 */
export function useUpdateRequestStatus() {
  const adminService = inject(AdminService);
  const queryClient = injectQueryClient();
  
  return injectMutation(() => ({
    mutationKey: ['admin', 'request', 'update'],
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await lastValueFrom(adminService.updateRequestStatus(id, status));
    },
    onSuccess: () => {
      // Invalidate all request-related queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'requests'] });
    }
  }));
}

/**
 * TanStack Query hook for fetching all users
 */
export function useAllUsers() {
  const adminService = inject(AdminService);
  
  return injectQuery(() => ({
    queryKey: ['admin', 'users', 'all'],
    queryFn: async () => {
      return await lastValueFrom(adminService.getAllUsers());
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  }));
}
