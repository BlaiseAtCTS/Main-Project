import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { useAllUsers } from '../../hooks/use-admin';
import { CardComponent, CardHeaderComponent, CardContentComponent } from '../ui/card.component';
import { ButtonComponent } from '../ui/button.component';
import { SpinnerComponent } from '../ui/spinner.component';
import { AlertComponent } from '../ui/alert.component';

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
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
})
export class AdminUsersComponent {
  allUsersQuery = useAllUsers();

  users = computed(() => this.allUsersQuery.data() || []);
  groupedUsers = computed(() => this.groupUserData());
  uniqueUserCount = computed(() => this.groupedUsers().length);
  isLoading = computed(() => this.allUsersQuery.isPending());

  constructor() {}

  private groupUserData(): GroupedUser[] {
    const userMap = new Map<string, GroupedUser>();
    const users = this.users();

    users.forEach((userAccount) => {
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

    return Array.from(userMap.values());
  }

  formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getTotalBalance(accounts: any[]): number {
    return accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }

  formatDate(dateString?: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getAccountTypeBadgeColor(type: string): string {
    switch (type?.toUpperCase()) {
      case 'SAVINGS': return 'bg-green-100 text-green-700';
      case 'CHECKING': return 'bg-blue-100 text-blue-700';
      case 'CREDIT': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  refresh(): void {
    this.allUsersQuery.refetch();
  }
}
