import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../ui/card.component';
import { ButtonComponent } from '../ui/button.component';
import { AccountRequest } from '../../models/account-request.model';

@Component({
  selector: 'app-account-requests-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    ButtonComponent
  ],
  template: `
    <ui-card class="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <ui-card-header class="border-b bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
        <ui-card-title class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Account Requests</h3>
              <p class="text-sm text-gray-600 font-normal">Track your account creation status</p>
            </div>
          </div>
          @if (pendingCount() > 0) {
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm animate-pulse">
              <span class="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
              {{ pendingCount() }} Pending
            </span>
          }
        </ui-card-title>
      </ui-card-header>

      <ui-card-content class="p-6">
        @if (requests().length === 0) {
          <div class="text-center py-12">
            <div class="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-gray-600 text-lg font-medium mb-2">No account requests yet</p>
            <p class="text-gray-500 text-sm">Your account creation requests will appear here</p>
          </div>
        } @else {
          <div class="space-y-4">
            @for (request of requests(); track request.id) {
              <div class="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
                   [ngClass]="{
                     'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 hover:border-amber-300': request.status === 'PENDING',
                     'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:border-green-300': request.status === 'APPROVED',
                     'border-red-200 bg-gradient-to-r from-red-50 to-rose-50 hover:border-red-300': request.status === 'REJECTED'
                   }">
                <!-- Status indicator bar -->
                <div class="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-2"
                     [ngClass]="{
                       'bg-gradient-to-b from-amber-400 to-amber-600': request.status === 'PENDING',
                       'bg-gradient-to-b from-green-400 to-green-600': request.status === 'APPROVED',
                       'bg-gradient-to-b from-red-400 to-red-600': request.status === 'REJECTED'
                     }"></div>

                <div class="p-5 pl-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <!-- Request type icon -->
                        <div class="h-10 w-10 rounded-lg flex items-center justify-center"
                             [ngClass]="{
                               'bg-amber-100': request.status === 'PENDING',
                               'bg-green-100': request.status === 'APPROVED',
                               'bg-red-100': request.status === 'REJECTED'
                             }">
                          @if (request.requestType === 'CREATE') {
                            <svg class="h-5 w-5"
                                 [ngClass]="{
                                   'text-amber-600': request.status === 'PENDING',
                                   'text-green-600': request.status === 'APPROVED',
                                   'text-red-600': request.status === 'REJECTED'
                                 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                          } @else {
                            <svg class="h-5 w-5"
                                 [ngClass]="{
                                   'text-amber-600': request.status === 'PENDING',
                                   'text-green-600': request.status === 'APPROVED',
                                   'text-red-600': request.status === 'REJECTED'
                                 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          }
                        </div>

                        <div class="flex-1">
                          <h4 class="text-base font-bold text-gray-900 mb-1">
                            {{ request.requestType === 'CREATE' ? 'Account Creation' : 'Account Deletion' }}
                          </h4>
                          <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span class="font-semibold">{{ request.accountType }}</span>
                            <span class="text-gray-400">•</span>
                            <span class="font-mono text-xs bg-white/70 px-2 py-1 rounded">{{ request.accountNumber }}</span>
                            @if (request.requestType === 'CREATE') {
                              <span class="text-gray-400">•</span>
                              <span class="font-semibold text-green-700">₹{{ formatCurrency(request.initialBalance) }}</span>
                            }
                          </div>
                        </div>
                      </div>

                      <!-- Date -->
                      <div class="flex items-center gap-2 text-xs text-gray-500 mt-3">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Requested {{ formatDate(request.createdAt) }}</span>
                      </div>
                    </div>

                    <!-- Status badge -->
                    <div>
                      @if (request.status === 'PENDING') {
                        <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-sm">
                          <svg class="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Awaiting Approval
                        </span>
                      } @else if (request.status === 'APPROVED') {
                        <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border-2 border-green-300 shadow-sm">
                          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Approved
                        </span>
                      } @else {
                        <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border-2 border-red-300 shadow-sm">
                          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          REJECTED
                        </span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- View all button -->
          @if (requests().length > 3) {
            <div class="mt-6 text-center">
              <ui-button variant="outline" routerLink="/account-requests" class="group">
                <span class="flex items-center gap-2">
                  View All Requests
                  <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </ui-button>
            </div>
          }
        }
      </ui-card-content>
    </ui-card>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .group {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class AccountRequestsCardComponent {
  requests = input.required<AccountRequest[]>();
  
  pendingCount = computed(() => 
    this.requests().filter(r => r.status === 'PENDING').length
  );

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
