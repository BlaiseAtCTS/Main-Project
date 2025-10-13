package com.site.banking.controller;

import com.site.banking.dto.AccountCreationDto;
import com.site.banking.dto.AccountDepositWithdrawDto;
import com.site.banking.dto.AccountNumberDto;
import com.site.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<String> depositAmount(@RequestBody AccountDepositWithdrawDto account) {
        return accountService.depositAmount(account);
    }
    // withdraw from acc
    @PostMapping("/withdraw") // { "accountNumber": , "balance": }
    public ResponseEntity<String> withdrawAmount(@RequestBody AccountDepositWithdrawDto account) {
        return accountService.withdrawAmount(account);
    }
    // check balance
    @PostMapping("/balance") // { "accountNumber": }
    public ResponseEntity<String> getAccountBalance(@RequestBody AccountNumberDto account) {
        return accountService.getAccountBalance(account);
    }
    // create acc
    @PostMapping("/create") // { "accountNumber": , "balance": , "type": }
    public ResponseEntity<String> registerAccount(Principal principal, @RequestBody AccountCreationDto account) {
        return accountService.createAccount(principal, account);
    }
    // delete acc
    @DeleteMapping("/delete") // { "accountNumber": }
    public ResponseEntity<String> deleteAccount(Principal principal, @RequestBody AccountNumberDto account) {
        return accountService.deleteAccount(principal, account);
    }
}
