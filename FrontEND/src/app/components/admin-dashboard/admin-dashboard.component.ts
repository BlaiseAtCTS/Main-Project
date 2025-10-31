import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { usePendingRequests, useUpdateRequestStatus } from '../../hooks/use-admin';
import { ToastService } from '../../services/toast.service';
import { CardComponent, CardHeaderComponent, CardContentComponent } from '../ui/card.component';
import { ButtonComponent } from '../ui/button.component';
import { SpinnerComponent } from '../ui/spinner.component';
import { AlertComponent } from '../ui/alert.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    ButtonComponent,
    SpinnerComponent,
  AlertComponent
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboardComponent {
  pendingRequestsQuery = usePendingRequests();
  updateStatusMutation = useUpdateRequestStatus();

  pendingRequests = computed(() => this.pendingRequestsQuery.data() || []);
  isLoading = computed(() => this.pendingRequestsQuery.isPending());

  private router = inject(Router);
  private toastService = inject(ToastService);

  constructor() {}

  approveRequest(requestId: number): void {
    this.updateStatusMutation.mutate(
      { id: requestId, status: 'APPROVED' },
      {
        onSuccess: () => {
          this.toastService.success('Request Approved', 'The request has been approved successfully');
          this.pendingRequestsQuery.refetch();
        },
        onError: (err: any) => {
          this.toastService.error('Approval Failed', err?.error?.message || 'Failed to approve request');
        }
      }
    );
  }

  rejectRequest(requestId: number): void {
    this.updateStatusMutation.mutate(
      { id: requestId, status: 'REJECTED' },
      {
        onSuccess: () => {
          this.toastService.success('Request Rejected', 'The request has been rejected');
          this.pendingRequestsQuery.refetch();
        },
        onError: (err: any) => {
          this.toastService.error('Rejection Failed', err?.error?.message || 'Failed to reject request');
        }
      }
    );
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
