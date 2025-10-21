package com.site.banking.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Schema(description = "Account entity representing a bank account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the account", example = "1")
    private Long id;
    
    @Column(unique = true)
    @Pattern(regexp = "^\\d{10}$", message = "Invalid account number")
    @Schema(description = "Unique account number", example = "ACC123456789")
    private String accountNumber;
    
    @Schema(description = "Account balance", example = "1000.00")
    private BigDecimal balance;
    
    @Schema(description = "Account type", example = "SAVINGS", allowableValues = {"SAVINGS", "CHECKING", "BUSINESS"})
    private String type;
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Transaction> transactions = new HashSet<>();
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Set<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        this.transactions = transactions;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
