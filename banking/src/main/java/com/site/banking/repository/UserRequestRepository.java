package com.site.banking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.site.banking.model.UserRequest;

@Repository
public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {
    List<UserRequest> findByRequestTypeAndStatus(String requestType, String status);
    List<UserRequest> findByStatus(String status);
    List<UserRequest> findByUserName(String userName);
}
