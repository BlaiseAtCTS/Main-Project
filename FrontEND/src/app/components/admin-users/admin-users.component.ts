import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { UserAccountData } from '../../models/admin.model';

interface GroupedUser {
  identifier: string;
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
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsersComponent implements OnInit {
  users = signal<UserAccountData[]>([]);
  groupedUsers = signal<GroupedUser[]>([]);
  uniqueUserCount = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadAllUsers();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  loadAllUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.groupUsersByIdentifier();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error.set('Failed to load users. Please try again.');
        this.loading.set(false);
        this.users.set([]);
      }
    });
  }

  groupUsersByIdentifier(): void {
    const userMap = new Map<string, GroupedUser>();

    this.users().forEach((userAccount: UserAccountData) => {
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

    this.groupedUsers.set(Array.from(userMap.values()));
    this.uniqueUserCount.set(this.groupedUsers().length);
  }

  formatCurrency(amount: number | null): string {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getTotalBalance(accounts: any[]): number {
    return accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
