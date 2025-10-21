import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <ng-container *ngIf="isLoggedIn; else loggedOut">
      <nav class="bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <span class="text-white font-bold">Ferrero Bank</span>
              <div class="hidden md:block ml-10 flex items-baseline space-x-4">
                <!-- Admin Navigation -->
                <ng-container *ngIf="isAdmin">
                  <a routerLink="/admin/dashboard" class="text-yellow-400 hover:text-white px-3 py-2 font-medium">Pending Requests</a>
                  <a routerLink="/admin/users" class="text-yellow-400 hover:text-white px-3 py-2 font-medium">All Users</a>
                  <a routerLink="/profile" class="text-gray-300 hover:text-white px-3 py-2">Profile</a>
                </ng-container>
                <!-- Regular User Navigation -->
                <ng-container *ngIf="!isAdmin">
                  <a routerLink="/dashboard" class="text-gray-300 hover:text-white px-3 py-2">Dashboard</a>
                  <a routerLink="/accounts" class="text-gray-300 hover:text-white px-3 py-2">Accounts</a>
                  <a routerLink="/transactions" class="text-gray-300 hover:text-white px-3 py-2">Transactions</a>
                  <a routerLink="/profile" class="text-gray-300 hover:text-white px-3 py-2">Profile</a>
                </ng-container>
              </div>
            </div>
            <div class="hidden md:block">
              <button (click)="logout()" class="text-gray-300 hover:text-white px-3 py-2">Logout</button>
            </div>
          </div>
        </div>
      </nav>
    </ng-container>

    <ng-template #loggedOut>
      <header class="bg-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="text-lg font-bold">Ferroro Bank</div>
            <div class="space-x-3">
              <a routerLink="/login" class="text-sm text-blue-600">Login</a>
              <a routerLink="/register" class="text-sm text-blue-600">Register</a>
            </div>
          </div>
        </div>
      </header>
    </ng-template>
  `
})
export class NavComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  private subscriptions: Subscription[] = [];
  private isBrowser = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Initial check
    this.checkAuthStatus();

    // Listen to route changes
    const routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
      });
    this.subscriptions.push(routerSub);

    // Listen to auth service changes
    const authSub = this.auth.currentUser$.subscribe(() => {
      this.checkAuthStatus();
    });
    this.subscriptions.push(authSub);

    // Also check every 500ms to catch any changes (as a fallback)
    if (this.isBrowser) {
      const interval = setInterval(() => {
        this.checkAuthStatus();
      }, 500);
      
      // Clean up interval on destroy
      this.subscriptions.push({
        unsubscribe: () => clearInterval(interval)
      } as Subscription);
    }
  }

  private checkAuthStatus() {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      const wasLoggedIn = this.isLoggedIn;
      const wasAdmin = this.isAdmin;
      
      this.isLoggedIn = !!token;
      this.isAdmin = role === 'ADMIN';
      
      // Only log if something changed
      if (wasLoggedIn !== this.isLoggedIn || wasAdmin !== this.isAdmin) {
        console.log('🔄 Nav state updated:', { 
          isLoggedIn: this.isLoggedIn, 
          isAdmin: this.isAdmin, 
          role: role,
          hasToken: !!token 
        });
        this.cdr.detectChanges();
      }
    }
  }

  logout() {
    console.log('🚪 Logout clicked');
    if (this.isBrowser) {
      // Clear all auth data
      localStorage.clear(); // Clear everything to be sure
      sessionStorage.clear();
      this.auth.logout();
      
      // Reset component state
      this.isLoggedIn = false;
      this.isAdmin = false;
      
      console.log('✅ Logged out - all storage cleared');
    }
    // Navigate to login
    this.router.navigate(['/login']).then(() => {
      // Force change detection after navigation
      this.checkAuthStatus();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
