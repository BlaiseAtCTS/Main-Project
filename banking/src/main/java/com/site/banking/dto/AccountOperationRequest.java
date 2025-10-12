package com.site.banking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Request object for account operations like deposit, withdraw and balance check")
public class AccountOperationRequest {

    @Schema(description = "Account number", example = "ACC123456789", required = true)
    private String accountNumber;

    @Schema(description = "Amount for deposit/withdraw operations", example = "100.00")
    private BigDecimal amount;

    public AccountOperationRequest() {}

    public AccountOperationRequest(String accountNumber, BigDecimal amount) {
        this.accountNumber = accountNumber;
        this.amount = amount;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
