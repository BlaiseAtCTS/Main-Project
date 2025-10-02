package com.site.banking.service;

import com.site.banking.model.Account;
import com.site.banking.model.Transaction;
import com.site.banking.model.User;
import com.site.banking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TransactionRepository transactionRepository;

    private static final String DEPOSIT = "DEPOSIT";
    private static final String WITHDRAWAL = "WITHDRAWAL";
    private static final String TRANSFER_OUT = "TRANSFER_OUT";
    private static final String TRANSFER_IN = "TRANSFER_IN";

    // Account creation
    @Transactional
    public String createAccount(String userName, Account newAccount) {
        // Validation of user
        Optional<User> userOpt = userRepository.findByUserName(userName);
        if (userOpt.isEmpty()) {
            return "userNameNoExist";
        }

        // Validation of account number
        if (accountRepository.existsByAccountNumber(newAccount.getAccountNumber())) {
            return "accountNumberExist";
        }

        // Ensuring initial balance is zero
        if (newAccount.getBalance() == null || newAccount.getBalance().compareTo(BigDecimal.ZERO) < 0) {
            newAccount.setBalance(BigDecimal.ZERO);
        }

        // Set relationship, save, and return success
        User user = userOpt.get();
        newAccount.setUser(user);
        user.getAccounts().add(newAccount);
        accountRepository.save(newAccount);

        return "accountCreated";
    }

    //Transaction Logging
    private void recordTransaction(Account account, String type, BigDecimal amount, boolean isCredit) {
        // Update balance
        if (isCredit) {
            account.setBalance(account.getBalance().add(amount));
        } else {
            account.setBalance(account.getBalance().subtract(amount));
        }

        // Save new balance
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);
    }

    // Deposit
    @Transactional
    public String performDeposit(String accountNumber, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return "invalidAmount";
        }

        Optional<Account> accountOpt = accountRepository.findByAccountNumber(accountNumber);
        if (accountOpt.isEmpty()) {
            return "notFound";
        }

        // Deposit(isCredit = true)
        recordTransaction(accountOpt.get(), DEPOSIT, amount, true);
        return "success";
    }

    // Withdraw
    @Transactional
    public String performWithdrawal(String accountNumber, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return "invalidAmount";
        }

        Optional<Account> accountOpt = accountRepository.findByAccountNumber(accountNumber);
        if (accountOpt.isEmpty()) {
            return "notFound";
        }

        Account account = accountOpt.get();

        //Check for sufficient funds
        if (account.getBalance().compareTo(amount) < 0) {
            return "insufficientFunds";
        }

        // Withdrawal(isCredit = false)
        recordTransaction(account, WITHDRAWAL, amount, false);
        return "success";
    }

    // Transfer

    @Transactional
    public String performTransfer(String sourceNumber, String destNumber, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return "invalidAmount";
        }
        if (sourceNumber.equals(destNumber)) {
            return "sameAccount";
        }

        Optional<Account> sourceOpt = accountRepository.findByAccountNumber(sourceNumber);
        Optional<Account> destOpt = accountRepository.findByAccountNumber(destNumber);

        if (sourceOpt.isEmpty()) return "sourceNotFound";
        if (destOpt.isEmpty()) return "destinationNotFound";

        Account sourceAccount = sourceOpt.get();

        // Check source funds BEFORE any change
        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            return "insufficientFunds";
        }

        // Debit(Transfer Out)
        recordTransaction(sourceAccount, TRANSFER_OUT, amount, false);

        // Credit(Transfer In)
        recordTransaction(destOpt.get(), TRANSFER_IN, amount, true);

        return "success";
    }


    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }
}