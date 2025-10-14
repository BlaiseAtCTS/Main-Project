package com.site.banking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.site.banking.model.User;
import com.site.banking.model.UserRequest;
import com.site.banking.repository.UserRepository;
import com.site.banking.repository.UserRequestRepository;

@Service
public class UserRequestService {
    
    @Autowired
    private UserRequestRepository userRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserRequest createUserRequest(String userName, String password, String firstName, String lastName, String requestType) {
        UserRequest request = new UserRequest(userName, password, firstName, lastName, requestType);
        return userRequestRepository.save(request);
    }
    
    public List<UserRequest> getPendingRequests(String requestType) {
        return userRequestRepository.findByRequestTypeAndStatus(requestType, "PENDING");
    }
    
    public List<UserRequest> getAllPendingRequests() {
        return userRequestRepository.findByStatus("PENDING");
    }
    
    public UserRequest updateRequestStatus(Long id, String status, String processedBy) {
        UserRequest request = userRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus(status);
        request.setProcessedDate(LocalDateTime.now());
        request.setProcessedBy(processedBy);
        
        // If approved and it's a registration request, create the user
        if ("APPROVED".equals(status) && "REGISTER".equals(request.getRequestType())) {
            createUserFromRequest(request);
        }
        // If approved and it's a deletion request, delete the user
        else if ("APPROVED".equals(status) && "DELETE".equals(request.getRequestType())) {
            deleteUserFromRequest(request);
        }
        
        return userRequestRepository.save(request);
    }
    
    private void createUserFromRequest(UserRequest request) {
        User user = new User();
        user.setUserName(request.getUserName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole("user");
        userRepository.save(user);
    }
    
    private void deleteUserFromRequest(UserRequest request) {
        User user = userRepository.findByUserName(request.getUserName());
        if (user != null) {
            userRepository.delete(user);
        }
    }
    
    public List<UserRequest> getUserRequestsByUsername(String userName) {
        return userRequestRepository.findByUserName(userName);
    }
}
