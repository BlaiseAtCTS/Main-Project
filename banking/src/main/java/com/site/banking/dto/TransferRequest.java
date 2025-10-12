package com.site.banking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Request object for money transfer operations")
public class TransferRequest {
    @Schema(description = "Source account number", example = "ACC123456789")
    private String sourceAccountNumber;
    
    @Schema(description = "Destination account number", example = "ACC987654321")
    private String destinationAccountNumber;
    
    @Schema(description = "Transfer amount", example = "500.00")
    private BigDecimal amount;

    public String getSourceAccountNumber() {
        return sourceAccountNumber;
    }

    public void setSourceAccountNumber(String sourceAccountNumber) {
        this.sourceAccountNumber = sourceAccountNumber;
    }

    public String getDestinationAccountNumber() {
        return destinationAccountNumber;
    }

    public void setDestinationAccountNumber(String destinationAccountNumber) {
        this.destinationAccountNumber = destinationAccountNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
