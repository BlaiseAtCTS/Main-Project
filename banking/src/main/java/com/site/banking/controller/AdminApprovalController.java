package com.site.banking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.site.banking.model.AccountRequest;
import com.site.banking.service.AccountRequestService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminApprovalController {

    private final AccountRequestService requestService;

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
}
