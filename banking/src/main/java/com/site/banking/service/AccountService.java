package com.site.banking.service;

import com.site.banking.model.Account;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;

    public String createAccount(String userName, Account account) {
        if(userRepository.existsByUserName(userName)) {
            User user = userRepository.findByUserName(userName);
            if(accountRepository.existsByAccountNumber(account.getAccountNumber())) {
                return "accountNumberExist";
            } else {
                account.setUser(user);
                user.getAccounts().add(account);
                accountRepository.save(account);
                return "accountCreated";
            }
        }
        return "userNameNoExist";
    }
}
