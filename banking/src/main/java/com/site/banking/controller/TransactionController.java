package com.site.banking.controller;

import com.site.banking.dto.TransferRequest;
import com.site.banking.model.Account;
import com.site.banking.model.Transaction;
import com.site.banking.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/transaction")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    // transfer
    @PostMapping("/transfer") // { "sourceAccountNumber": , "destinationAccountNumber": , "amount": }
    public ResponseEntity<String> transferAmount(@RequestBody TransferRequest transferRequest) {
        return transactionService.transferAmount(transferRequest);
    }
}
