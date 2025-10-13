package com.site.banking.dto;

import java.math.BigDecimal;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Account information for profile view")
public class AccountDto {
    @Schema(description = "Account number")
    private String accountNumber;

    @Schema(description = "Current balance")
    private BigDecimal balance;

    @Schema(description = "Account type (SAVINGS, CHECKING, etc.)")
    private String type;

    // Constructors
    public AccountDto() {}

    public AccountDto(String accountNumber, BigDecimal balance, String type) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.type = type;
    }

    // Getters and Setters
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}