import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { TransferRequest } from '../../models/transaction.model';
import { injectMutation } from '@tanstack/angular-query-experimental';

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

  protected transferMutation = injectMutation(() => ({
    mutationFn: (transfer: TransferRequest) => this.transactionService.transfer(transfer),
  }));

  transferAmount(): void {
    this.transferMutation.mutate(this.transferRequest, {
      onSuccess: (response) => {
        if (response.success) {
          this.transferRequest = {
            sourceAccountNumber: '',
            destinationAccountNumber: '',
            amount: 0
          };
        } else {
          throw new Error(response.message || 'Failed to transfer amount');
        }
      },
      onError: (error: Error) => {
        console.error('Transfer error:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

