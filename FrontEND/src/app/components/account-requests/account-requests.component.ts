import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { useAccountRequests } from '../../hooks/use-account-requests';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../ui/card.component';
import { ButtonComponent } from '../ui/button.component';
import { SpinnerComponent } from '../ui/spinner.component';
import { AlertComponent } from '../ui/alert.component';
import { AccountRequest } from '../../models/account-request.model';

@Component({
  selector: 'app-account-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    ButtonComponent,
    SpinnerComponent,
    AlertComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Account Requests</h1>
              <p class="text-gray-600">Track the status of your account creation requests</p>
            </div>
            <ui-button variant="outline" routerLink="/dashboard" class="group">
              <span class="flex items-center gap-2">
                <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </span>
            </ui-button>
          </div>

          <!-- Stats Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-amber-700 font-medium mb-1">Pending</p>
                  <p class="text-2xl font-bold text-amber-900">{{ pendingCount() }}</p>
                </div>
                <div class="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center">
                  <svg class="h-6 w-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-green-700 font-medium mb-1">Approved</p>
                  <p class="text-2xl font-bold text-green-900">{{ approvedCount() }}</p>
                </div>
                <div class="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                  <svg class="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-red-700 font-medium mb-1">Declined</p>
                  <p class="text-2xl font-bold text-red-900">{{ declinedCount() }}</p>
                </div>
                <div class="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
                  <svg class="h-6 w-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        @if (accountRequestsQuery.isPending()) {
          <ui-card>
            <ui-card-content class="p-12">
              <div class="flex flex-col items-center justify-center">
                <ui-spinner size="lg"></ui-spinner>
                <p class="mt-4 text-gray-600">Loading your requests...</p>
              </div>
            </ui-card-content>
          </ui-card>
        }

        <!-- Error State -->
        @if (accountRequestsQuery.isError()) {
          <ui-alert variant="error">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="ml-2">Failed to load account requests</span>
          </ui-alert>
        }

        <!-- Requests List with Scroll Area -->
        @if (!accountRequestsQuery.isPending() && !accountRequestsQuery.isError()) {
          @if (accountRequestsQuery.data()?.length === 0) {
            <!-- Empty State -->
            <ui-card>
              <ui-card-content class="p-12">
                <div class="text-center">
                  <div class="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">No Account Requests</h3>
                  <p class="text-gray-600 mb-6">You haven't made any account creation requests yet</p>
                  <ui-button routerLink="/accounts/create">
                    <span class="flex items-center gap-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Create Account Request
                    </span>
                  </ui-button>
                </div>
              </ui-card-content>
            </ui-card>
          } @else {
            <!-- Scrollable Requests List -->
            <ui-card class="border-0 shadow-xl">
              <ui-card-header class="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <ui-card-title class="flex items-center justify-between">
                  <span class="text-lg font-bold">All Requests</span>
                  <span class="text-sm font-normal text-gray-600">{{ accountRequestsQuery.data()?.length }} total</span>
                </ui-card-title>
              </ui-card-header>

              <!-- Shadcn-style Scroll Area -->
              <div class="relative max-h-[600px] overflow-hidden">
                <div class="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div class="p-6 space-y-4">
                    @for (request of accountRequestsQuery.data(); track request.id) {
                      <div class="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer"
                           [ngClass]="{
                             'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 hover:border-amber-300': request.status === 'PENDING',
                             'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:border-green-300': request.status === 'APPROVED',
                             'border-red-200 bg-gradient-to-r from-red-50 to-rose-50 hover:border-red-300': request.status === 'DECLINED'
                           }">
                        <!-- Status indicator bar -->
                        <div class="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-2"
                             [ngClass]="{
                               'bg-gradient-to-b from-amber-400 to-amber-600': request.status === 'PENDING',
                               'bg-gradient-to-b from-green-400 to-green-600': request.status === 'APPROVED',
                               'bg-gradient-to-b from-red-400 to-red-600': request.status === 'DECLINED'
                             }"></div>

                        <div class="p-5 pl-6">
                          <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                              <div class="flex items-center gap-3 mb-3">
                                <!-- Request type icon -->
                                <div class="h-12 w-12 rounded-lg flex items-center justify-center shadow-sm"
                                     [ngClass]="{
                                       'bg-amber-100': request.status === 'PENDING',
                                       'bg-green-100': request.status === 'APPROVED',
                                       'bg-red-100': request.status === 'DECLINED'
                                     }">
                                  @if (request.requestType === 'CREATE') {
                                    <svg class="h-6 w-6"
                                         [ngClass]="{
                                           'text-amber-600': request.status === 'PENDING',
                                           'text-green-600': request.status === 'APPROVED',
                                           'text-red-600': request.status === 'DECLINED'
                                         }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                  } @else {
                                    <svg class="h-6 w-6"
                                         [ngClass]="{
                                           'text-amber-600': request.status === 'PENDING',
                                           'text-green-600': request.status === 'APPROVED',
                                           'text-red-600': request.status === 'DECLINED'
                                         }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  }
                                </div>

                                <div class="flex-1">
                                  <h4 class="text-lg font-bold text-gray-900 mb-1">
                                    {{ request.requestType === 'CREATE' ? 'Account Creation Request' : 'Account Deletion Request' }}
                                  </h4>
                                  <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                    <span class="font-semibold text-base">{{ request.accountType }}</span>
                                    <span class="text-gray-400">•</span>
                                    <span class="font-mono text-xs bg-white/70 px-2 py-1 rounded border">{{ request.accountNumber }}</span>
                                    @if (request.requestType === 'CREATE') {
                                      <span class="text-gray-400">•</span>
                                      <span class="font-semibold text-green-700">₹{{ formatCurrency(request.initialBalance) }}</span>
                                    }
                                  </div>
                                </div>
                              </div>

                              <!-- Date and Request ID -->
                              <div class="flex items-center gap-4 text-xs text-gray-500 ml-15">
                                <div class="flex items-center gap-1">
                                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{{ formatDate(request.createdAt) }}</span>
                                </div>
                                <span class="text-gray-400">•</span>
                                <div class="flex items-center gap-1">
                                  <span class="font-mono">#{{ request.id }}</span>
                                </div>
                              </div>
                            </div>

                            <!-- Status badge -->
                            <div class="flex-shrink-0">
                              @if (request.status === 'PENDING') {
                                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-sm">
                                  <svg class="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Pending
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
                                  Declined
                                </span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Scroll fade indicators -->
                <div class="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>
            </ui-card>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    /* Custom scrollbar styles */
    .scrollbar-thin::-webkit-scrollbar {
      width: 8px;
    }

    .scrollbar-thin::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Firefox */
    .scrollbar-thin {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f1f1;
    }
  `]
})
export class AccountRequestsComponent {
  accountRequestsQuery = useAccountRequests();

  pendingCount = signal(0);
  approvedCount = signal(0);
  declinedCount = signal(0);

  constructor() {
    // Update counts when data changes using effect
    effect(() => {
      const data = this.accountRequestsQuery.data();
      if (data) {
        this.pendingCount.set(data.filter((r: AccountRequest) => r.status === 'PENDING').length);
        this.approvedCount.set(data.filter((r: AccountRequest) => r.status === 'APPROVED').length);
        this.declinedCount.set(data.filter((r: AccountRequest) => r.status === 'DECLINED').length);
      }
    });
  }

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
