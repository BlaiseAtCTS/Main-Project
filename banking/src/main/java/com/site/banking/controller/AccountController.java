package com.site.banking.controller;

import com.site.banking.dto.DepositRequest;
import com.site.banking.dto.TransferRequest;
import com.site.banking.model.Account;
import com.site.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/account")
public class AccountController {
    @Autowired
    private AccountService accountService;

    // Account creation
    @PostMapping("/create/{userName}")
    public ResponseEntity<String> registerUser(@PathVariable String userName, @RequestBody Account account) {
        String response = accountService.createAccount(userName, account);

        if(response.equals("userNameNoExist")) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User doesn't exist");
        } else if(response.equals("accountNumberExist")) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Account already exists");
        }
        // Success response
        return ResponseEntity
                .status(HttpStatus.CREATED) // Status 201 for resource creation
                .body("Account created for "+userName);
    }

    // get balance
    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<?> getAccountBalance(@PathVariable String accountNumber) {
        Optional<Account> accountOpt = accountService.getAccountByNumber(accountNumber);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
        }

        // Return balance
        return ResponseEntity.ok(accountOpt.get().getBalance());
    }

    // Deposit
    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestBody DepositRequest request) {
        String response = accountService.performDeposit(request.getAccountNumber(), request.getAmount());

        return switch (response) {
            case "success" -> ResponseEntity.ok("Deposit successful for account: " + request.getAccountNumber());
            case "accountNotFound" -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
            case "invalidAmount" -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid deposit amount.");
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Deposit failed.");
        };
    }

    // 4. Withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody DepositRequest request) {
        String response = accountService.performWithdrawal(request.getAccountNumber(), request.getAmount());

        return switch (response) {
            case "success" -> ResponseEntity.ok("Withdrawal successful from account: " + request.getAccountNumber());
            case "accountNotFound" -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
            case "invalidAmount" -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid withdrawal amount.");
            case "insufficientFunds" -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient funds.");
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Withdrawal failed.");
        };
    }

    // Transfer
    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody TransferRequest request) {
        String response = accountService.performTransfer(
                request.getSourceAccountNumber(),
                request.getDestinationAccountNumber(),
                request.getAmount()
        );

        return switch (response) {
            case "success" -> ResponseEntity.ok("Transfer successful from " + request.getSourceAccountNumber() + " to " + request.getDestinationAccountNumber());
            case "invalidAmount", "sameAccount", "insufficientFunds" ->
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            case "sourceNotFound" ->
                    ResponseEntity.status(HttpStatus.NOT_FOUND).body("Source account not found.");
            case "destinationNotFound" ->
                    ResponseEntity.status(HttpStatus.NOT_FOUND).body("Destination account not found.");
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Transfer failed.");
        };
    }
}