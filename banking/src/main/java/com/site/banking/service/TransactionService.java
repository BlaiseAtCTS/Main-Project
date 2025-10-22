package com.site.banking.service;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.dto.TransferRequest;
import com.site.banking.model.Account;
import com.site.banking.model.Transaction;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.math.BigDecimal;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;

    // Transfer logging
    private void recordTransfer(TransferRequest transferRequest) {
        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setSourceAccountNumber(transferRequest.getSourceAccountNumber());
        transaction.setDestinationAccountNumber(transferRequest.getDestinationAccountNumber());
        transaction.setAmount(transferRequest.getAmount());
        transaction.setType("Transfer");
        transaction.setTimestamp(LocalDateTime.now());
        Account account1 = accountRepository.findByAccountNumber(transferRequest.getSourceAccountNumber());
        transaction.setAccount(account1);
        transactionRepository.save(transaction);
    }

    @Transactional
    public ResponseEntity<ApiResponseDto> transferAmount(TransferRequest transferRequest) {
        if(transferRequest.getAmount() == null || transferRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Amount not valid", null, null));
        } else if(transferRequest.getSourceAccountNumber().equals(transferRequest.getDestinationAccountNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Source account & Destination account can't be same", null, null));
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Account sourceAcc = accountRepository.findByAccountNumberAndUserUserName(transferRequest.getSourceAccountNumber(), username);
        if(sourceAcc == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "Source account not found", null, null));
        }
        Account destAcc = accountRepository.findByAccountNumber(transferRequest.getDestinationAccountNumber());
        if(destAcc == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "Destination account not found", null, null));
        }

        if(sourceAcc.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Balance is insufficient", null, null));
        }

        sourceAcc.setBalance(sourceAcc.getBalance().subtract(transferRequest.getAmount()));
        destAcc.setBalance(destAcc.getBalance().add(transferRequest.getAmount()));

        accountRepository.save(sourceAcc);
        accountRepository.save(destAcc);

        recordTransfer(transferRequest);

        return ResponseEntity.ok(new ApiResponseDto(true, "Transferred fund: $"+transferRequest.getAmount(), null, null));
    }
}
