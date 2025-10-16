import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

// User with accounts interface
interface UserAccount {
  userId: number;
  username: string;
  accountType: string;
  accountNumber: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: UserAccount[] = [];
  loading = false;
  error: string | null = null;

  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadAllUsers();
  }

  private checkAuthentication() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'ADMIN') {
      this.router.navigate(['/login']);
    }
  }

  loadAllUsers() {
    this.loading = true;
    this.error = null;

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Loading users - Auth check:', { hasToken: !!token, role: role });
    
    if (!token) {
      this.error = 'No authentication token found. Please login again.';
      this.loading = false;
      return;
    }

    if (role !== 'ADMIN') {
      this.error = 'Access denied. Admin privileges required.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Loading all users with accounts...');
    console.log('Request URL:', `${this.baseUrl}/users`);

    this.http.get<UserAccount[]>(`${this.baseUrl}/users`, { headers })
      .subscribe({
        next: (data) => {
          console.log('Users data response:', data);
          this.users = Array.isArray(data) ? data : [];
          console.log('Loaded users:', this.users);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          
          if (error.status === 401) {
            this.error = 'Unauthorized. Please login as admin again.';
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else if (error.status === 403) {
            this.error = 'Access forbidden. Admin privileges required.';
          } else {
            this.error = `Failed to load users: ${error.error?.message || error.message || 'Unknown error'}`;
          }
          
          this.loading = false;
          this.users = [];
        }
      });
  }

  logout() {
    console.log('Admin users logout clicked');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Force full page reload to clear all state
    });
  }
}
