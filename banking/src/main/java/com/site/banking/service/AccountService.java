package com.site.banking.service;

import com.site.banking.dto.TransferRequest;
import com.site.banking.model.Account;
import com.site.banking.model.Transaction;
import com.site.banking.model.User;
import com.site.banking.model.UserPrincipal;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.TransactionRepository;
import com.site.banking.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Set;

@Service
public class AccountService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    // BigDecimal comparison
    public boolean validAmount(Account a,Account b){
        if(a.getBalance().compareTo(b.getBalance()) > 0){
            return false;
        }
        return true;
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
    public ResponseEntity<String> getAccountBalance(Account account) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Account account1 = accountRepository.findByAccountNumberAndUserUserName(account.getAccountNumber(), username);
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Account not found");
        }
        return ResponseEntity.ok("Balance: "+account1.getBalance());
    }

    @Transactional
    public ResponseEntity<String> depositAmount(Account account) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Account account1 = accountRepository.findByAccountNumberAndUserUserName(account.getAccountNumber(), username);
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Account not found");
        }
        account1.setBalance(account1.getBalance().add(account.getBalance()));
        recordDepositWithdraw(account1, account.getBalance(), DepositWithdraw.DEPOSIT);
        accountRepository.save(account1);
        return ResponseEntity.ok("Amount deposited. Balance: "+account1.getBalance());
    }

    @Transactional
    public ResponseEntity<String> withdrawAmount(Account account) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account1 = accountRepository.findByAccountNumberAndUserUserName(account.getAccountNumber(), username);
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Account not found");
        }
        if(validAmount(account1, account)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Withdraw amount cant be greater than balance. Balance: "+account1.getBalance());
        }
        account1.setBalance(account1.getBalance().subtract(account.getBalance()));
        recordDepositWithdraw(account1, account.getBalance(), DepositWithdraw.WITHDRAW);
        accountRepository.save(account1);

        return ResponseEntity.ok("Withdrawn "+account.getBalance()+". Balance: "+account1.getBalance());
    }

    @Transactional
    public ResponseEntity<String> createAccount(Principal principal, Account account) {
        User user = userRepository.findByUserName(principal.getName());
        if(user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User doesn't exist");
        }
        if(accountRepository.existsByAccountNumber(account.getAccountNumber())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Account already exist");
        }
        account.setUser(user);
        user.getAccounts().add(account);
        accountRepository.save(account);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Account created for "+principal.getName());
    }

    @Transactional
    public ResponseEntity<String> deleteAccount(Principal principal, Account account) {
        User user = userRepository.findByUserName(principal.getName());
        if(user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User doesn't exist");
        }
        Account account1 = accountRepository.findByAccountNumber(account.getAccountNumber());
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(principal.getName()+" has no account with this account number");
        }
        accountRepository.deleteById(account1.getId());
        accountRepository.save(account);
        return ResponseEntity.ok("Account deleted");
    }
}
