package com.site.banking.service;

import com.site.banking.dto.TransferRequest;
import com.site.banking.model.Account;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Set;

@Service
public class AccountService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;
    // BigDecimal comparison
    public boolean validAmount(Account a,Account b){
        if(a.getBalance().compareTo(b.getBalance()) > 0){
            return false;
        }
        return true;
    }

    @Transactional
    public ResponseEntity<String> getAccountBalance(Account account) {
        Account account1 = accountRepository.findByAccountNumber(account.getAccountNumber());
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Account not found");
        }
        return ResponseEntity.ok("Balance: "+account1.getBalance());
    }

    @Transactional
    public ResponseEntity<String> depositAmount(Account account) {
        Account account1 = accountRepository.findByAccountNumber(account.getAccountNumber());
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Account not found");
        }
        account1.setBalance(account1.getBalance().add(account.getBalance()));
        accountRepository.save(account1);
        return ResponseEntity.ok("Amount deposited. Balance: "+account1.getBalance());
    }

    @Transactional
    public ResponseEntity<String> withdrawAmount(Account account) {
        Account account1 = accountRepository.findByAccountNumber(account.getAccountNumber());
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
        accountRepository.save(account1);
        return ResponseEntity.ok("Withdrawn "+account.getBalance()+". Balance: "+account1.getBalance());
    }

    @Transactional
    public ResponseEntity<String> createAccount(String userName, Account account) {
        User user = userRepository.findByUserName(userName);
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
                .body("Account created for "+userName);
    }

    @Transactional
    public ResponseEntity<String> deleteAccount(String userName, Account account) {
        User user = userRepository.findByUserName(userName);
        if(user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User doesn't exist");
        }
        Account account1 = accountRepository.findByAccountNumber(account.getAccountNumber());
        if(account1 == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(userName+" has no account with this account number");
        }
        accountRepository.deleteById(account1.getId());
        accountRepository.save(account);
        return ResponseEntity.ok("Account deleted");
    }

    @Transactional
    public ResponseEntity<String> transferAmount(TransferRequest transferRequest) {
        if(transferRequest.getAmount() == null || transferRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Amount not valid");
        } else if(transferRequest.getSourceAccountNumber().equals(transferRequest.getDestinationAccountNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Source account & Destination account can't be same");
        }

        Account sourceAcc = accountRepository.findByAccountNumber(transferRequest.getSourceAccountNumber());
        if(sourceAcc == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Source account not found");
        }
        Account destAcc = accountRepository.findByAccountNumber(transferRequest.getDestinationAccountNumber());
        if(destAcc == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Destination account not found");
        }

        if(sourceAcc.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Balance is insufficient");
        }

        sourceAcc.setBalance(sourceAcc.getBalance().subtract(transferRequest.getAmount()));
        destAcc.setBalance(destAcc.getBalance().add(transferRequest.getAmount()));

        accountRepository.save(sourceAcc);
        accountRepository.save(destAcc);

        return ResponseEntity.ok("Transferred fund: $"+transferRequest.getAmount());
    }
}
