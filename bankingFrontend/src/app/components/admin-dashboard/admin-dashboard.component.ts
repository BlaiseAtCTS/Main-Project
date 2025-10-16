import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

// Account request interface
interface AccountRequestItem {
  id: number;
  userId: number;
  accountNumber: string;
  accountType: string;
  initialBalance?: number;
  requestType: string;
  status: string;
  createdAt?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  accountRequests: AccountRequestItem[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadAllRequests();
  }

  private checkAuthentication() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'ADMIN') {
      this.router.navigate(['/login']);
    }
  }

  loadAllRequests() {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'No authentication token found. Please log in again.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<AccountRequestItem[]>(`${this.baseUrl}/requests/pending`, { headers })
      .subscribe({
        next: (data) => {
          const requests = Array.isArray(data) ? data : [];
          // Sort by createdAt date, newest first
          this.accountRequests = requests.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading pending account requests:', error);
          this.error = `Failed to load account requests. Please try again later.`;
          this.loading = false;
          this.accountRequests = [];
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
      'Authorization': `Bearer ${token}`
    });

    // We pass an empty body for the PUT request
    this.http.put(`${this.baseUrl}/requests/${id}/${status}`, {}, { headers })
      .subscribe({
        next: () => {
          this.successMessage = `Account request has been successfully ${status.toLowerCase()}.`;
          this.error = null;
          this.loadAllRequests(); // Reload data to show the change
          
          // Clear the success message after a few seconds
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (error) => {
          this.error = `Failed to ${status.toLowerCase()} the account request.`;
          this.successMessage = null;
          console.error(`Error updating account request:`, error);
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-badge status-badge-warning';
      case 'APPROVED': return 'status-badge status-badge-success';
      case 'DECLINED': return 'status-badge status-badge-danger';
      default: return 'status-badge status-badge-secondary';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
