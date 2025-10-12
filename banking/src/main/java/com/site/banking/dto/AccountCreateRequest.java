package com.site.banking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Request object for creating or deleting an account")
public class AccountCreateRequest {

    @Schema(description = "Account number to create/delete", example = "ACC123456789", required = true)
    private String accountNumber;

    @Schema(description = "Initial balance for account creation", example = "0.00")
    private BigDecimal initialBalance;

    @Schema(description = "Account type", example = "SAVINGS")
    private String type;

    public AccountCreateRequest() {}

    public AccountCreateRequest(String accountNumber, BigDecimal initialBalance, String type) {
        this.accountNumber = accountNumber;
        this.initialBalance = initialBalance;
        this.type = type;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
