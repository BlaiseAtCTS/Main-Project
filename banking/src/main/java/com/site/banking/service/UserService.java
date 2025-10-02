package com.site.banking.service;

import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;

    public boolean createUser(User user) {
        if(userRepository.existsByUserName(user.getUserName())) {
            return true;
        }
        userRepository.save(user);
        return false;
    }

    public List<String> views() {
        List<User> userList = userRepository.findAll();
        List<String> response = new ArrayList<>();
        for(User user: userList) {
            StringBuilder strings = new StringBuilder();
            strings.append("Username: "+user.getUserName()+" Accounts: ");
            user.getAccounts().forEach((acc) -> {
                strings.append(acc.getBalance()+", ");
            });
            response.add(strings.toString());
        }
        return response;
    }
}
