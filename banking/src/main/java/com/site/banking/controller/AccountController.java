package com.site.banking.controller;

import com.site.banking.dto.TransferRequest;
import com.site.banking.model.Account;
import com.site.banking.model.User;
import com.site.banking.model.UserPrincipal;
import com.site.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

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
    @PostMapping("/balance") // { "accountNumber": }
    public ResponseEntity<String> getAccountBalance(@RequestBody Account account) {
        return accountService.getAccountBalance(account);
    }
    // create acc
    @PostMapping("/create") // { "accountNumber": , "balance": , "type": }
    public ResponseEntity<String> registerAccount(Principal principal, @RequestBody Account account) {
        return accountService.createAccount(principal, account);
    }
    // delete acc
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(Principal principal, @RequestBody Account account) {
        return accountService.deleteAccount(principal, account);
    }
}
