package com.site.banking.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.model.AccountRequest;
import com.site.banking.model.User;
import com.site.banking.repository.UserRepository;
import com.site.banking.service.AccountRequestService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/user/account-requests")
@Tag(name = "User Account Requests", description = "APIs for users to view their account requests")
@SecurityRequirement(name = "bearerAuth")
public class UserRequestController {

    @Autowired
    private AccountRequestService requestService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get all user's account requests", 
               description = "Returns all account requests (pending, approved, declined) for the logged-in user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Requests retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<?> getUserRequests(@Parameter(hidden = true) Principal principal) {
        User user = userRepository.findByUserName(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "User not found"));
        }
        
        List<AccountRequest> requests = requestService.getUserRequests(user.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get user's pending requests", 
               description = "Returns only pending account requests for the logged-in user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pending requests retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<?> getUserPendingRequests(@Parameter(hidden = true) Principal principal) {
        User user = userRepository.findByUserName(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDto(false, "User not found"));
        }
        
        List<AccountRequest> requests = requestService.getUserPendingRequests(user.getId());
        return ResponseEntity.ok(requests);
    }
}
