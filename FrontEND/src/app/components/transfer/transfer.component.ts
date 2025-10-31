import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { useTransfer } from '../../hooks/use-transaction';
import { TransferRequest } from '../../models/transaction.model';
import { ToastService } from '../../services/toast.service';
// UI components
import { ButtonComponent } from '../ui/button.component';
import { InputComponent } from '../ui/input.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../ui/card.component';
import { LabelComponent } from '../ui/label.component';
import { SpinnerComponent } from '../ui/spinner.component';
// Removed background gradient for shadcn look

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    LabelComponent,
  SpinnerComponent,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-2xl animate-fade-in">
          <ui-card>
            <ui-card-header class="text-center space-y-2">
              <ui-card-title>Transfer Money</ui-card-title>
              <ui-card-description>Move funds securely between accounts</ui-card-description>
            </ui-card-header>

            <ui-card-content>
              <form (ngSubmit)="onSubmit()" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <ui-label>From Account</ui-label>
                    <ui-input
                      type="text"
                      name="sourceAccountNumber"
                      placeholder="Source account number"
                      [(ngModel)]="form.sourceAccountNumber"
                      [disabled]="isPending"
                      class="w-full"
                    ></ui-input>
                  </div>

                  <div class="space-y-2">
                    <ui-label>To Account</ui-label>
                    <ui-input
                      type="text"
                      name="destinationAccountNumber"
                      placeholder="Destination account number"
                      [(ngModel)]="form.destinationAccountNumber"
                      [disabled]="isPending"
                      class="w-full"
                    ></ui-input>
                  </div>
                </div>

                <div class="space-y-2">
                  <ui-label>Amount</ui-label>
                  <ui-input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    [(ngModel)]="form.amount"
                    [disabled]="isPending"
                    class="w-full"
                  ></ui-input>
                </div>

                <ui-button
                  type="submit"
                  variant="default"
                  size="lg"
                  class="w-full"
                  [disabled]="isSubmitDisabled()"
                >
                  <span *ngIf="!isPending" class="flex items-center justify-center gap-2">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7H7m6 0h6m-6 0v6m0-6v6m0 0H7m6 0h6" />
                    </svg>
                    Transfer
                  </span>
                  <span *ngIf="isPending" class="flex items-center justify-center gap-2">
                    <ui-spinner size="sm"></ui-spinner>
                    Processing...
                  </span>
                </ui-button>
              </form>
            </ui-card-content>

            <ui-card-footer class="justify-between">
              <a routerLink="/accounts" class="text-sm text-primary-600 hover:text-primary-700">Back to accounts</a>
            </ui-card-footer>
          </ui-card>
      </div>
    </div>
  `,
  styleUrls: ['./transfer.css']
})
export class TransferComponent {
  form: TransferRequest = {
    sourceAccountNumber: '',
    destinationAccountNumber: '',
    amount: 0,
  };

  transferMutation = useTransfer();
  private toastService = inject(ToastService);

  get isPending(): boolean {
    return this.transferMutation.isPending();
  }

  isSubmitDisabled(): boolean {
    return (
      this.isPending ||
      !this.form.sourceAccountNumber ||
      !this.form.destinationAccountNumber ||
      !this.form.amount ||
      this.form.amount <= 0
    );
  }

  onSubmit(): void {
    this.transferMutation.mutate(this.form, {
      onSuccess: (res) => {
        if (res?.success) {
          const successMsg = res.message || 'Transfer successful';
          this.toastService.success('Transfer Successful', successMsg);
          // reset amount only, keep accounts for multiple transfers
          this.form.amount = 0;
        } else {
          const errorMsg = res?.message || 'Transfer failed';
          this.toastService.error('Transfer Failed', errorMsg);
        }
      },
      onError: (err: any) => {
        const errorMsg = err?.error?.message || 'Transfer failed. Please try again.';
        this.toastService.error('Transfer Failed', errorMsg);
      },
    });
  }
}
