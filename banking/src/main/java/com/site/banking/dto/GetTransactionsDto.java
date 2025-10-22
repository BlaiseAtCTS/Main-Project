package com.site.banking.dto;

public class GetTransactionsDto {
    private String sourceAccountNumber;

    public String getSourceAccountNumber() {
        return sourceAccountNumber;
    }

    public void setSourceAccountNumber(String sourceAccountNumber) {
        this.sourceAccountNumber = sourceAccountNumber;
    }
}
