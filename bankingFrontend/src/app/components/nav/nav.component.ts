import { Component, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
              <div class="flex-shrink-0">
                <span class="text-white font-bold">Banking App</span>
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <a
                    routerLink="/dashboard"
                    routerLinkActive="bg-gray-900"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    routerLink="/accounts"
                    routerLinkActive="bg-gray-900"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Accounts
                  </a>
                  <a
                    routerLink="/transactions"
                    routerLinkActive="bg-gray-900"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Transactions
                  </a>
                  <a
                    routerLink="/profile"
                    routerLinkActive="bg-gray-900"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </a>
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="ml-4 flex items-center md:ml-6">
                <button
                  (click)="logout()"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
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
  `,
})
export class NavComponent implements OnDestroy {
  isLoggedIn = false;
  private sub: Subscription | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.sub = this.auth.currentUser$.subscribe((token) => {
      this.isLoggedIn = !!token;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
