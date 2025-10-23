import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { AccountRequest } from '../../models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  pendingRequests = signal<AccountRequest[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  activeTab = signal('pending');

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadPendingRequests();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  loadPendingRequests(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getPendingRequests().subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
        this.pendingRequests.set(sorted);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading pending requests:', error);
        this.error.set('Failed to load pending requests. Please try again.');
        this.loading.set(false);
        this.pendingRequests.set([]);
      }
    });
  }

  approveRequest(id: number): void {
    if (!confirm('Are you sure you want to approve this request?')) {
      return;
    }

    this.adminService.updateRequestStatus(id, 'APPROVED').subscribe({
      next: () => {
        this.successMessage.set('Request approved successfully!');
        this.error.set(null);
        this.loadPendingRequests();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        this.error.set('Failed to approve request. Please try again.');
        this.successMessage.set(null);
        console.error('Error approving request:', error);
      }
    });
  }

  declineRequest(id: number): void {
    if (!confirm('Are you sure you want to decline this request?')) {
      return;
    }

    this.adminService.updateRequestStatus(id, 'DECLINED').subscribe({
      next: () => {
        this.successMessage.set('Request declined successfully!');
        this.error.set(null);
        this.loadPendingRequests();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        this.error.set('Failed to decline request. Please try again.');
        this.successMessage.set(null);
        console.error('Error declining request:', error);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge bg-warning text-dark';
      case 'APPROVED': return 'badge bg-success';
      case 'DECLINED': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getRequestTypeBadgeClass(type: string): string {
    return type === 'CREATE' ? 'badge bg-primary' : 'badge bg-danger';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  formatCurrency(amount?: number): string {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getCreateRequestsCount(): number {
    return this.pendingRequests().filter((r: AccountRequest) => r.requestType === 'CREATE').length;
  }

  getDeleteRequestsCount(): number {
    return this.pendingRequests().filter((r: AccountRequest) => r.requestType === 'DELETE').length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
