package com.site.banking.service;

import com.site.banking.model.Account;
import com.site.banking.model.Transfer;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.TransferRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

public class TransferService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransferRepository transferRepository;

    public Transfer performTransfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount){
        Account sender = accountRepository.findByAccountNumber(fromAccountNumber);
        Account receiver = accountRepository.findByAccountNumber(toAccountNumber);
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
        Transfer transferRecord = new Transfer(fromAccountNumber,toAccountNumber,amount);
        return transferRepository.save(transferRecord);
    }
}
