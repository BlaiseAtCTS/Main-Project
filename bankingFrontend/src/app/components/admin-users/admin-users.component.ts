import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

// User with accounts interface matching backend response
interface UserAccount {
  username: string | null;
  phoneNumber: string | null;
  dob: string | null;
  email: string | null;
  address: string | null;
  accountType: string;
  accountNumber: string;
  balance: number | null;
}

// Grouped user interface
interface GroupedUser {
  identifier: string; // username, email, or phone
  displayName: string;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  dob: string | null;
  accounts: {
    accountType: string;
    accountNumber: string;
    balance: number | null;
  }[];
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
  groupedUsers: GroupedUser[] = [];
  uniqueUserCount = 0;
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
          this.groupUsersByUserId();
          console.log('Loaded users:', this.users);
          console.log('Grouped users:', this.groupedUsers);
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

  private groupUsersByUserId() {
    const userMap = new Map<string, GroupedUser>();

    this.users.forEach(userAccount => {
      // Create a unique identifier for each user
      // Priority: username > email > phoneNumber > accountNumber
      const identifier = userAccount.username 
        || userAccount.email 
        || userAccount.phoneNumber 
        || `User-${userAccount.accountNumber}`;
      
      const displayName = userAccount.username 
        || userAccount.email 
        || userAccount.phoneNumber 
        || 'Unknown User';

      if (!userMap.has(identifier)) {
        userMap.set(identifier, {
          identifier: identifier,
          displayName: displayName,
          phoneNumber: userAccount.phoneNumber,
          email: userAccount.email,
          address: userAccount.address,
          dob: userAccount.dob,
          accounts: []
        });
      }

      const groupedUser = userMap.get(identifier)!;
      groupedUser.accounts.push({
        accountType: userAccount.accountType,
        accountNumber: userAccount.accountNumber,
        balance: userAccount.balance,
      });
    });

    this.groupedUsers = Array.from(userMap.values());
    this.uniqueUserCount = this.groupedUsers.length;
  }

  logout() {
    console.log('Admin users logout clicked');
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    sessionStorage.clear();
    
    // Navigate to login and force reload to clear any cached state
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
