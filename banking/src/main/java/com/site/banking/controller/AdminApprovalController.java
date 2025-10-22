package com.site.banking.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.site.banking.model.Account;
import com.site.banking.model.AccountRequest;
import com.site.banking.model.User;
import com.site.banking.repository.UserRepository;
import com.site.banking.service.AccountRequestService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminApprovalController {

    private final AccountRequestService requestService;
    
    @Autowired
    private UserRepository userRepository;

    public AdminApprovalController(AccountRequestService requestService) {
        this.requestService = requestService;
    }

    // Get pending account creation requests
    @GetMapping("/requests/create")
    public List<AccountRequest> getCreateRequests() {
        return requestService.getPendingRequests("CREATE");
    }

    // Get pending account deletion requests
    @GetMapping("/requests/delete")
    public List<AccountRequest> getDeleteRequests() {
        return requestService.getPendingRequests("DELETE");
    }

    // Approve or Decline
    @PutMapping("/requests/{id}/{status}")
    public AccountRequest updateRequestStatus(@PathVariable Long id, @PathVariable String status) {
        AccountRequest request = requestService.updateStatus(id, status.toUpperCase());
        
        // If approved, execute the account creation or deletion
        if ("APPROVED".equals(status.toUpperCase())) {
            requestService.executeApprovedRequest(request);
        }
        
        return request;
    }

    // Combined pending requests (both CREATE and DELETE)
    @GetMapping("/requests/pending")
    public List<AccountRequest> getAllPending() {
        return requestService.getAllPendingRequests();
    }
    
    // Get all users with their accounts
    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsersWithAccounts() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {
            // Skip admin users
            if ("admin".equalsIgnoreCase(user.getRole())) {
                continue;
            }

            if (user.getAccounts() != null && !user.getAccounts().isEmpty()) {
                // Add one entry per account
                for (Account account : user.getAccounts()) {
                    Map<String, Object> userAccount = new HashMap<>();
                    userAccount.put("username", user.getUserName());
                    userAccount.put("phoneNumber", user.getPhoneNumber());
                    userAccount.put("dob", user.getDob());
                    userAccount.put("email", user.getEmail());
                    userAccount.put("address", user.getAddress());
                    userAccount.put("accountType", account.getType());
                    userAccount.put("accountNumber", account.getAccountNumber());
                    result.add(userAccount);
                }
            } else {
                // Add users without accounts
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("username", user.getUserName());
                userInfo.put("phoneNumber", user.getPhoneNumber());
                userInfo.put("dob", user.getDob());
                userInfo.put("email", user.getEmail());
                userInfo.put("address", user.getAddress());
                userInfo.put("accountType", "N/A");
                userInfo.put("accountNumber", "N/A");
                result.add(userInfo);
            }
        }

        return result;
    }
}
