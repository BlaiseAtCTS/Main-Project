import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminApprovalComponent } from './admin-approval/admin-approval.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AdminGuard] },
  { path: 'admin/approvals', component: AdminApprovalComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/login' }
];
