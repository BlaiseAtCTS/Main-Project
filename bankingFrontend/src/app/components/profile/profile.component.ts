import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserProfile } from '../../models/user-profile.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      @if (profileQuery.isPending()) {
      <div class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>
      } @if (profileQuery.error()) {
      <div class="mt-4 p-4 bg-red-100 text-red-700 rounded">
        {{ profileQuery.error()?.message || 'An error occurred while loading your profile.' }}
      </div>
      } @if (profileQuery.data()) {
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Profile Information</h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-4">Personal Details</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-gray-600">Full Name</label>
                <div class="text-gray-900">
                  {{ profileQuery.data()?.firstName }} {{ profileQuery.data()?.lastName }}
                </div>
              </div>
              <div>
                <label class="block text-gray-600">Username</label>
                <div class="text-gray-900">{{ profileQuery.data()?.userName }}</div>
              </div>
              <div>
                <label class="block text-gray-600">Email</label>
                <div class="text-gray-900">{{ profileQuery.data()?.email || 'Not provided' }}</div>
              </div>
              <div>
                <label class="block text-gray-600">Phone Number</label>
                <div class="text-gray-900">{{ profileQuery.data()?.phoneNumber || 'Not provided' }}</div>
              </div>
              <div>
                <label class="block text-gray-600">Date of Birth</label>
                <div class="text-gray-900">{{ profileQuery.data()?.dateOfBirth || 'Not provided' }}</div>
              </div>
              <div>
                <label class="block text-gray-600">Age</label>
                <div class="text-gray-900">{{ profileQuery.data()?.age || 'Not provided' }}</div>
              </div>
              <div>
                <label class="block text-gray-600">Gender</label>
                <div class="text-gray-900">{{ profileQuery.data()?.gender || 'Not provided' }}</div>
              </div>
              <div>
                <label class="block text-gray-600">Occupation</label>
                <div class="text-gray-900">{{ profileQuery.data()?.occupation || 'Not provided' }}</div>
              </div>
              <div>
                <label class="block text-gray-600">Address</label>
                <div class="text-gray-900">{{ profileQuery.data()?.address || 'Not provided' }}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Accounts</h3>
            <div class="space-y-4">
              @for (account of profileQuery.data()?.accounts || []; track account.accountNumber) {
              <div class="border rounded p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-medium">{{ account.type }}</div>
                    <div class="text-sm text-gray-600">{{ account.accountNumber }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold">
                      {{ account.balance != null ? (account.balance | number : '1.2-2') : '—' }}
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
        </div>

     
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ProfileComponent {
  constructor(private apiService: ApiService) {}

  protected profileQuery = injectQuery(() => ({
    queryKey: ['profile'],
    queryFn: () => this.apiService.getUserProfile(),
    select: (data: UserProfile) => {
      if (!data || !data.userName) {
        throw new Error('Unexpected profile structure returned');
      }
      return data;
    },
    retry: 2,
  }));
}
