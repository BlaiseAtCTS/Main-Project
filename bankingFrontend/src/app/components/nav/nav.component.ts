import { Component, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
              <span class="text-white font-bold">Banking App</span>
              <div class="hidden md:block ml-10 flex items-baseline space-x-4">
                <!-- Admin Navigation -->
                <ng-container *ngIf="isAdmin">
                  <a routerLink="/admin/dashboard" class="text-yellow-400 hover:text-white px-3 py-2 font-medium">Admin Dashboard</a>
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
            <div class="text-lg font-bold">Banking App</div>
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
export class NavComponent implements OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  private sub: Subscription | null = null;
  private isBrowser = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // ✅ Inject platform
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // ✅ detect environment

    this.sub = this.auth.currentUser$.subscribe(() => {
      if (this.isBrowser) { // ✅ only use localStorage in browser
        this.isLoggedIn = !!localStorage.getItem('token');
        const role = localStorage.getItem('role');
        this.isAdmin = role === 'ADMIN';
        console.log('Navigation - Role check:', { role, isAdmin: this.isAdmin, isLoggedIn: this.isLoggedIn });
      }
      setTimeout(() => this.cdr.detectChanges(), 0);

    });
  }

  logout() {
    if (this.isBrowser) {
      this.auth.logout();
    }
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
