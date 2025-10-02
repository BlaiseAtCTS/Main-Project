package com.site.banking.service;

import com.site.banking.model.Account;
import com.site.banking.model.Transaction;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.TransactionRepository;
import com.site.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;


    public boolean validAmount(Account acc,Transaction tc){
//        BigDecimal balance = account.getBalance();
        if(tc.getAmount().compareTo(acc.getBalance()) > 0){
            return false;
        }
        return true;
    }

    public String initiateTransaction(Account acc,Transaction tc){
        if(validAmount(acc,tc)){
            BigDecimal newBalance = acc.getBalance().subtract(tc.getAmount());
            acc.setBalance(newBalance);
            return "transactionSuccess";
        }
        else{
            return "AmountgreaterthanBalance"; // invalid amount
        }
    }



}
