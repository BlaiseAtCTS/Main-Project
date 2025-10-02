package com.site.banking.repository;

import com.site.banking.model.Account;
import com.site.banking.model.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransferRepository extends JpaRepository<Transfer,Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
}
