package com.site.banking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.site.banking.model.Account;
import com.site.banking.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySourceAccountNumber(String sourceAccountNumber);
    List<Transaction> findByAccount(Account account);
}
