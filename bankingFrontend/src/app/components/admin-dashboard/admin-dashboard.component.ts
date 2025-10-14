import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// Account request interface
interface AccountRequestItem {
  id: number;
  userId: number;
  accountNumber: string;
  accountType: string;
  requestType: string;
  status: string;
  createdAt?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  accountRequests: AccountRequestItem[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log('Admin Dashboard initialized');
    this.checkAuthentication();
    this.loadAllRequests();
  }

  private checkAuthentication() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('Auth check:', { token: !!token, role });
    
    if (!token || role !== 'ADMIN') {
      console.log('Not authenticated as admin, redirecting...');
      this.router.navigate(['/login']);
      return;
    }
  }

  loadAllRequests() {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'No authentication token found';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Loading account requests with headers:', headers);

    // Single combined pending requests call
    this.http.get<AccountRequestItem[]>(`${this.baseUrl}/requests/pending`, { headers })
      .subscribe({
        next: (data) => {
          console.log('Pending account requests response:', data);
            // Sort by createdAt desc if present
          const sorted = (data || []).sort((a,b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
          });
          this.accountRequests = sorted;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading pending account requests:', error);
          this.error = `Failed to load account requests: ${error.message || 'Unknown error'}`;
          this.loading = false;
        }
      });
  }

  approveAccountRequest(id: number) {
    this.updateAccountRequestStatus(id, 'APPROVED');
  }

  declineAccountRequest(id: number) {
    this.updateAccountRequestStatus(id, 'DECLINED');
  }

  private updateAccountRequestStatus(id: number, status: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(`${this.baseUrl}/requests/${id}/${status}`, {}, { headers })
      .subscribe({
        next: () => {
          this.successMessage = `Account request ${status.toLowerCase()} successfully`;
          this.error = null;
          this.loadAllRequests(); // Reload data
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          this.error = `Failed to ${status.toLowerCase()} account request: ${error.message || 'Unknown error'}`;
          this.successMessage = null;
          console.error(`Error ${status.toLowerCase()}ing account request:`, error);
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-badge-warning';
      case 'APPROVED': return 'status-badge-success';
      case 'DECLINED': return 'status-badge-danger';
      default: return 'status-badge-secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
