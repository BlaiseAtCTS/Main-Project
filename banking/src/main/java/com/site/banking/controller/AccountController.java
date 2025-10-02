package com.site.banking.controller;

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
    // deposit in acc
    @PostMapping("/deposit") // { "accountNumber": , "balance": }
    public ResponseEntity<String> depositAmount(@RequestBody Account account) {
        return accountService.depositAmount(account);
    }

    @PostMapping("/withdraw") // { "accountNumber": , "balance": }
    public ResponseEntity<String> withdrawAmount(@RequestBody Account account) {
        return accountService.withdrawAmount(account);
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
