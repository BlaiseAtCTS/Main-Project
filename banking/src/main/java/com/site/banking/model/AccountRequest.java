package com.site.banking.model;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "account_requests")
@JsonInclude(JsonInclude.Include.ALWAYS)
public class AccountRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Reference to user table
    private String requestType; // "CREATE" or "DELETE"
    private String status; // "PENDING", "APPROVED", "DECLINED"
    private String accountNumber; // Account number for create/delete
    private String accountType; // Account type (SAVINGS, CHECKING, etc.) for CREATE requests
    
    @Column(precision = 19, scale = 2)
    private BigDecimal initialBalance; // Initial balance for CREATE requests
    @CreationTimestamp
    private Instant createdAt; // When the request was submitted

    public AccountRequest() {}

    public AccountRequest(Long userId, String requestType, String status) {
        this.userId = userId;
        this.requestType = requestType;
        this.status = status;
    }
    
    public AccountRequest(Long userId, String requestType, String status, String accountNumber, String accountType) {
        this.userId = userId;
        this.requestType = requestType;
        this.status = status;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
    }
    
    public AccountRequest(Long userId, String requestType, String status, String accountNumber, String accountType, BigDecimal initialBalance) {
        this.userId = userId;
        this.requestType = requestType;
        this.status = status;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.initialBalance = initialBalance;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getRequestType() {
        return requestType;
    }
    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getAccountNumber() {
        return accountNumber;
    }
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    public String getAccountType() {
        return accountType;
    }
    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }
    public BigDecimal getInitialBalance() {
        return initialBalance != null ? initialBalance : BigDecimal.ZERO;
    }
    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
