package com.site.banking.dto;

import java.math.BigDecimal;

public class AccountDepositWithdrawDto {
    private String accountNumber;
    private BigDecimal balance;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
