import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { TransferRequest } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transferRequest: TransferRequest = {
    sourceAccountNumber: '',
    destinationAccountNumber: '',
    amount: 0
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  transferAmount(): void {
    this.isLoading = true;
    this.clearMessages();

    this.transactionService.transfer(this.transferRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Transfer completed successfully!';
        this.transferRequest = {
          sourceAccountNumber: '',
          destinationAccountNumber: '',
          amount: 0
        };
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error || 'Failed to transfer amount. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
