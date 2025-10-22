package com.site.banking.service;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.model.Account;
import com.site.banking.model.AccountRequest;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.AccountRequestRepository;
import com.site.banking.repository.UserRepository;

@Service
public class AccountRequestService {

    private static final Logger log = LoggerFactory.getLogger(AccountRequestService.class);

    private final AccountRequestRepository requestRepo;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AccountRepository accountRepository;

    public AccountRequestService(AccountRequestRepository requestRepo) {
        this.requestRepo = requestRepo;
    }

    public List<AccountRequest> getPendingRequests(String type) {
        return requestRepo.findByRequestTypeAndStatus(type, "PENDING");
    }

    public List<AccountRequest> getAllPendingRequests() {
        return requestRepo.findByStatus("PENDING");
    }

    public AccountRequest updateStatus(Long id, String status) {
        AccountRequest req = requestRepo.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(status);
        return requestRepo.save(req);
    }

    public AccountRequest createRequest(Long userId, String type) {
        AccountRequest req = new AccountRequest(userId, type, "PENDING");
        return requestRepo.save(req);
    }
    
    // New method for account creation requests with account details
    public ResponseEntity<ApiResponseDto> submitCreateRequest(Principal principal, String accountNumber, String accountType, BigDecimal initialBalance) {
        User user = userRepository.findByUserName(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "User not found"));
        }
        
        // Use initialBalance if provided, otherwise default to 1000 (Min balance)
        BigDecimal balance = (initialBalance.compareTo(BigDecimal.valueOf(1000)) > 0) ? initialBalance : BigDecimal.valueOf(1000);
        
        AccountRequest req = new AccountRequest(user.getId(), "CREATE", "PENDING", accountNumber, accountType, balance);
        requestRepo.save(req);
        log.info("Saved CREATE account request id={} userId={} accountNumber={} type={} initialBalance={}", req.getId(), user.getId(), accountNumber, accountType, balance);

        return ResponseEntity.ok(new ApiResponseDto(true, "Account creation request submitted for admin approval"));
    }
    
    // New method for account deletion requests
    public ResponseEntity<ApiResponseDto> submitDeleteRequest(Principal principal, String accountNumber) {
        User user = userRepository.findByUserName(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "User not found"));
        }
        
        AccountRequest req = new AccountRequest(user.getId(), "DELETE", "PENDING", accountNumber, null);
        requestRepo.save(req);
        log.info("Saved DELETE account request id={} userId={} accountNumber={}", req.getId(), user.getId(), accountNumber);

        return ResponseEntity.ok(new ApiResponseDto(true, "Account deletion request submitted for admin approval"));
    }
    
    // Execute approved request (create or delete account)
    public void executeApprovedRequest(AccountRequest request) {
        if ("CREATE".equals(request.getRequestType())) {
            // Create the account
            User user = userRepository.findById(request.getUserId()).orElse(null);
            if (user != null) {
                Account account = new Account();
                account.setAccountNumber(request.getAccountNumber());
                account.setType(request.getAccountType());
                
                // Use the initial balance from the request, or default to ZERO if not specified
                BigDecimal initialBalance = (request.getInitialBalance() != null) 
                        ? request.getInitialBalance() 
                        : BigDecimal.ZERO;
                account.setBalance(initialBalance);
                
                account.setUser(user);
                accountRepository.save(account);
                
                log.info("Created account {} with initial balance {} for user {}", 
                        account.getAccountNumber(), initialBalance, user.getUserName());
            }
        } else if ("DELETE".equals(request.getRequestType())) {
            // Delete the account
            Account account = accountRepository.findByAccountNumber(request.getAccountNumber());
            if (account != null) {
                accountRepository.delete(account);
                log.info("Deleted account {}", request.getAccountNumber());
            }
        }
    }
}
