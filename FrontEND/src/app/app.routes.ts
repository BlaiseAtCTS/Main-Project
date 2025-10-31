import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { nonAdminGuard } from './guards/non-admin.guard';
import { roleBasedRedirectGuard } from './guards/role-based-redirect.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShellLayoutComponent } from './components/shell-layout/shell-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', canActivate: [roleBasedRedirectGuard], pathMatch: 'full', children: [] },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Dashboard' }
      },
      { 
        path: 'accounts', 
        loadComponent: () => import('./components/accounts/accounts.component').then(m => m.AccountsComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Accounts' }
      },
      { 
        path: 'accounts/create', 
        loadComponent: () => import('./components/accounts/create-account/create-account.component').then(m => m.CreateAccountComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Create Account' }
      },
      { 
        path: 'accounts/deposit', 
        loadComponent: () => import('./components/accounts/deposit/deposit.component').then(m => m.DepositComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Deposit' }
      },
      { 
        path: 'accounts/withdraw', 
        loadComponent: () => import('./components/accounts/withdraw/withdraw.component').then(m => m.WithdrawComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Withdraw' }
      },
      { 
        path: 'accounts/delete', 
        loadComponent: () => import('./components/accounts/delete-account/delete-account.component').then(m => m.DeleteAccountComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Delete Account' }
      },
      { 
        path: 'transactions', 
        loadComponent: () => import('./components/transactions/transactions.component').then(m => m.TransactionsComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Transactions' }
      },
      { 
        path: 'transfer', 
        loadComponent: () => import('./components/transfer/transfer.component').then(m => m.TransferComponent),
        canActivate: [nonAdminGuard],
        data: { breadcrumb: 'Transfer Money' }
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
        data: { breadcrumb: 'Profile' }
      },
      { 
        path: 'admin/dashboard', 
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [adminGuard],
        data: { breadcrumb: 'Admin Dashboard' }
      },
      { 
        path: 'admin/users', 
        loadComponent: () => import('./components/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
        canActivate: [adminGuard],
        data: { breadcrumb: 'All Users' }
      }
    ]
  }
];
