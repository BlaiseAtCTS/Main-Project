package com.site.banking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.site.banking.model.AccountRequest;

public interface AccountRequestRepository extends JpaRepository<AccountRequest, Long> {
    List<AccountRequest> findByRequestTypeAndStatus(String requestType, String status);
    List<AccountRequest> findByStatus(String status);
    
    // User-specific queries
    List<AccountRequest> findByUserId(Long userId);
    List<AccountRequest> findByUserIdAndStatus(Long userId, String status);
    List<AccountRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
}
