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
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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
  
  // Helper method to format date
  formatDate(date: string | null | undefined): string {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
