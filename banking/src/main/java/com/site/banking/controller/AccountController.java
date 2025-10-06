package com.site.banking.controller;

import com.site.banking.dto.TransferRequest;
import com.site.banking.model.Account;
import com.site.banking.model.User;
import com.site.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/account")
public class AccountController {
    @Autowired
    private AccountService accountService;
    // deposit to acc
    @PostMapping("/deposit") // { "accountNumber": , "balance": }
    public ResponseEntity<String> depositAmount(@RequestBody Account account) {
        return accountService.depositAmount(account);
    }
    // withdraw from acc
    @PostMapping("/withdraw") // { "accountNumber": , "balance": }
    public ResponseEntity<String> withdrawAmount(@RequestBody Account account) {
        return accountService.withdrawAmount(account);
    }
    // check balance
    @GetMapping("/balance") // { "accountNumber": }
    public ResponseEntity<String> getAccountBalance(@RequestBody Account account) {
        return accountService.getAccountBalance(account);
    }
    // transfer
    @PostMapping("/transfer") // { "sourceAccountNumber": , "destinationAccountNumber": , "amount": }
    public ResponseEntity<String> transferAmount(@RequestBody TransferRequest transferRequest) {
        return accountService.transferAmount(transferRequest);
    }
    // create acc
    @PostMapping("/create/{userName}") // { "accountNumber": , "balance": , "type": }
    public ResponseEntity<String> registerAccount(@PathVariable String userName, @RequestBody Account account) {
        return accountService.createAccount(userName, account);
    }
    // delete acc
    @DeleteMapping("/delete/{userName}")
    public ResponseEntity<String> deleteAccount(@PathVariable String userName, @RequestBody Account account) {
        return accountService.deleteAccount(userName, account);
    }
}
