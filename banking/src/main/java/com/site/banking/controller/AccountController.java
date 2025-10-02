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
        return ResponseEntity.ok("Account created for "+userName);
    }
}
