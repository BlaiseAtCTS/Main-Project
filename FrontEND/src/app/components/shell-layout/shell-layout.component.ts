import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SheetComponent } from '../ui/sheet.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../ui/breadcrumbs.component';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SheetComponent, BreadcrumbsComponent],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.css']
})
export class ShellLayoutComponent implements OnInit {
  // Inject services using inject() function for early initialization
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  
  sidebarOpen = signal(false);
  breadcrumbs = signal<BreadcrumbItem[]>([]);
  
  // Convert BehaviorSubject to signal for reactivity
  private authToken = toSignal(this.authService.currentUser$, { initialValue: this.authService.getToken() });
  
  isAuthenticated = computed(() => !!this.authToken());
  isAdmin = computed(() => this.authService.isAdmin());
  username = computed(() => this.authService.getUsername() || 'Guest');

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'home', requiresAuth: true },
    { label: 'Accounts', route: '/accounts', icon: 'wallet', requiresAuth: true },
    { label: 'Transactions', route: '/transactions', icon: 'receipt', requiresAuth: true },
    { label: 'Profile', route: '/profile', icon: 'user', requiresAuth: true },
    { label: 'Admin Dashboard', route: '/admin/dashboard', icon: 'shield', requiresAdmin: true },
    { label: 'All Users', route: '/admin/users', icon: 'users', requiresAdmin: true }
  ];

  visibleNavItems = computed(() => {
    const isAdminUser = this.isAdmin();
    
    return this.navItems.filter(item => {
      // Admin users should only see admin items and profile
      if (isAdminUser) {
        return item.requiresAdmin || item.route === '/profile';
      }
      
      // Regular users see everything except admin items
      if (item.requiresAdmin) return false;
      if (item.requiresAuth) return this.isAuthenticated();
      return true;
    });
  });

  constructor() {
    // Breadcrumbs generation and close sidebar on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs.set(this.createBreadcrumbs(this.activatedRoute.root));
        // Close sidebar on navigation to prevent it staying open
        this.closeSidebar();
      });
  }

  ngOnInit(): void {
    // Initial breadcrumb
    this.breadcrumbs.set(this.createBreadcrumbs(this.activatedRoute.root));
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'] || this.getLabelFromPath(routeURL);
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getLabelFromPath(path: string): string {
    const labels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'accounts': 'Accounts',
      'create': 'Create Account',
      'deposit': 'Deposit',
      'withdraw': 'Withdraw',
      'delete': 'Delete Account',
      'transactions': 'Transactions',
      'transfer': 'Transfer Money',
      'profile': 'Profile',
      'admin': 'Admin',
      'users': 'Users'
    };
    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getIconPath(icon: string): string {
    const icons: { [key: string]: string } = {
      'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'wallet': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      'receipt': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      'arrow-right-left': 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4',
      'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'shield': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'users': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    };
    return icons[icon] || '';
  }
}
