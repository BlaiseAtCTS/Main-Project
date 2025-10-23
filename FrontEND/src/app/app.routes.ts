import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./components/accounts/accounts.component').then(m => m.AccountsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'accounts/create', 
    loadComponent: () => import('./components/accounts/create-account/create-account.component').then(m => m.CreateAccountComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'accounts/deposit', 
    loadComponent: () => import('./components/accounts/deposit/deposit.component').then(m => m.DepositComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'accounts/withdraw', 
    loadComponent: () => import('./components/accounts/withdraw/withdraw.component').then(m => m.WithdrawComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'accounts/delete', 
    loadComponent: () => import('./components/accounts/delete-account/delete-account.component').then(m => m.DeleteAccountComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'transactions', 
    loadComponent: () => import('./components/transactions/transactions.component').then(m => m.TransactionsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'transfer', 
    loadComponent: () => import('./components/transfer/transfer.component').then(m => m.TransferComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin/dashboard', 
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  { 
    path: 'admin/users', 
    loadComponent: () => import('./components/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
    canActivate: [adminGuard]
  }
];
