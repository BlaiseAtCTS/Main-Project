package com.site.banking.service;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.model.Account;
import com.site.banking.model.Transaction;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.TransactionRepository;
import com.site.banking.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AccountService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    // BigDecimal comparison
    // Returns true if withdrawal is valid (balance >= withdrawal amount)
    // Returns false if withdrawal is invalid (balance < withdrawal amount)
    public boolean validAmount(Account a,Account b){
        if(a.getBalance().compareTo(b.getBalance()) >= 0){
            return true;  // Valid: balance >= withdrawal amount
        }
        return false;  // Invalid: balance < withdrawal amount
    }

    public String generateAccountNumber(String username, String accountType) {
        int typeCode;
        switch (accountType.toUpperCase()) {
            case "SAVINGS": typeCode = 1; break;
            case "CURRENT": typeCode = 0; break;
            case "BUSINESS": typeCode = 4; break;
            default: typeCode = 9;
        }
        long timestamp = System.currentTimeMillis();
        String rawInput = username + timestamp + typeCode;
        String accountNumber = String.valueOf(Math.abs(rawInput.hashCode()));
        while (accountNumber.length() < 10) {
            accountNumber = "0" + accountNumber;
        }
        return accountNumber;
    }

    enum DepositWithdraw { DEPOSIT, WITHDRAW };

    // Deposit & Withdraw logging
    private void recordDepositWithdraw(Account account, BigDecimal amount, DepositWithdraw type) {
        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setSourceAccountNumber(account.getAccountNumber());
        transaction.setDestinationAccountNumber(null);
        transaction.setAmount(amount);
        switch(type) {
            case DEPOSIT:
                transaction.setType("Deposit");
                break;
            case WITHDRAW:
                transaction.setType("Withdraw");
                break;
        }
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setAccount(account);
        transactionRepository.save(transaction);
    }

    @Transactional
    public ResponseEntity<ApiResponseDto> getAccountBalance(Principal principal, Account account) {
        String username = principal.getName();

        Account account1 = accountRepository.findByAccountNumberAndUserUserName(account.getAccountNumber(), username);
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "Account not found"));
        }
        return ResponseEntity.ok(new ApiResponseDto(true, "Balance: $" + account1.getBalance()));
    }

    @Transactional
    public ResponseEntity<ApiResponseDto> depositAmount(Principal principal, Account account) {
        String username = principal.getName();

        Account account1 = accountRepository.findByAccountNumberAndUserUserName(account.getAccountNumber(), username);
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "Account not found"));
        }
        account1.setBalance(account1.getBalance().add(account.getBalance()));
        recordDepositWithdraw(account1, account.getBalance(), DepositWithdraw.DEPOSIT);
        accountRepository.save(account1);
        return ResponseEntity.ok(new ApiResponseDto(true, "Amount deposited. Balance: $" + account1.getBalance()));
    }

    @Transactional
    public ResponseEntity<ApiResponseDto> withdrawAmount(Principal principal, Account account) {
        String username = principal.getName();

        Account account1 = accountRepository.findByAccountNumberAndUserUserName(account.getAccountNumber(), username);
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "Account not found"));
        }
        if(!validAmount(account1, account)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Withdraw amount can't be greater than balance. Balance: $" + account1.getBalance()));
        }
        account1.setBalance(account1.getBalance().subtract(account.getBalance()));
        recordDepositWithdraw(account1, account.getBalance(), DepositWithdraw.WITHDRAW);
        accountRepository.save(account1);

        return ResponseEntity.ok(new ApiResponseDto(true, "Withdrawn $" + account.getBalance() + ". Balance: $" + account1.getBalance()));
    }

    @Transactional
    public ResponseEntity<ApiResponseDto> createAccount(Principal principal, Account account) {
        User user = userRepository.findByUserName(principal.getName());
        if(user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "User doesn't exist"));
        }
        if(accountRepository.existsByAccountNumber(account.getAccountNumber())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponseDto(false, "Account already exists"));
        }
        account.setUser(user);
        user.getAccounts().add(account);
        accountRepository.save(account);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponseDto(true, "Account created for " + principal.getName()));
    }

    @Transactional
    public ResponseEntity<ApiResponseDto> deleteAccount(Principal principal, Account account) {
        User user = userRepository.findByUserName(principal.getName());
        if(user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "User doesn't exist"));
        }
        Account account1 = accountRepository.findByAccountNumber(account.getAccountNumber());
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, principal.getName() + " has no account with this account number"));
        }
        accountRepository.deleteById(account1.getId());
        accountRepository.save(account);
        return ResponseEntity.ok(new ApiResponseDto(true, "Account deleted successfully"));
    }
}
