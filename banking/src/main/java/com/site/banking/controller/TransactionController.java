package com.site.banking.controller;


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
    private TransactionService  transactionService;

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdrawAmount(@RequestBody Account account, @RequestBody Transaction transaction){
        String response = transactionService.initiateTransaction(account,transaction);
        if(response.equals("transactionSuccess")){
           // No idea how to use response entity
        } else if (response.equals("AmountgreaterthanBalance")) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Enter an amount lesser than balance");
        }
        return ResponseEntity.ok("Amount withdrawed successfully! Balance: "+account.getBalance());
    }

}
