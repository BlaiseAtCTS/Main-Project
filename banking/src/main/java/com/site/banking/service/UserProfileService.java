package com.site.banking.service;

import com.site.banking.dto.AccountDto;
import com.site.banking.dto.UserProfileResponseDto;
import com.site.banking.model.Account;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public UserProfileResponseDto getUserProfile(String username) {
        User user = userRepository.findByUserName(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<Account> accounts = accountRepository.findByUser(user);
        List<AccountDto> accountDtos = accounts.stream()
            .map(this::mapToAccountDto)
            .collect(Collectors.toList());

        return new UserProfileResponseDto(
            user.getFirstName(),
            user.getLastName(),
            user.getUserName(),
            user.getEmail(),
            user.getPhoneNumber(),
            user.getDob(),
            user.getAddress(),
            accountDtos
        );
    }

    private AccountDto mapToAccountDto(Account account) {
        return new AccountDto(
            account.getAccountNumber(),
            account.getBalance(),
            account.getType().toString()
        );
    }
}