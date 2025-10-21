package com.site.banking.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.site.banking.dto.AccountCreateRequest;
import com.site.banking.dto.AccountOperationRequest;
import com.site.banking.dto.ApiResponseDto;
import com.site.banking.model.Account;
import com.site.banking.service.AccountRequestService;
import com.site.banking.service.AccountService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/account")
@Tag(name = "Account Management", description = "APIs for account operations including deposits, withdrawals, and balance inquiries")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private AccountRequestService requestService;
    @PostMapping("/deposit")
    @Operation(summary = "Deposit amount", description = "Deposits the specified amount to the given account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deposit successful"),
            @ApiResponse(responseCode = "400", description = "Invalid account or amount"),
            @ApiResponse(responseCode = "404", description = "Account not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> depositAmount(
            @Parameter(hidden = true) Principal principal,
            @RequestBody AccountOperationRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.getAccountNumber());
        account.setBalance(request.getAmount());
        return accountService.depositAmount(principal, account);
    }

    @PostMapping("/withdraw")
    @Operation(summary = "Withdraw amount", description = "Withdraws the specified amount from the given account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Withdrawal successful"),
            @ApiResponse(responseCode = "400", description = "Invalid account or insufficient funds"),
            @ApiResponse(responseCode = "404", description = "Account not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> withdrawAmount(
            @Parameter(hidden = true) Principal principal,
            @RequestBody AccountOperationRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.getAccountNumber());
        account.setBalance(request.getAmount());
        return accountService.withdrawAmount(principal, account);
    }

    @PostMapping("/balance")
    @Operation(summary = "Check account balance", description = "Retrieves the current balance of the specified account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Balance retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Account not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> getAccountBalance(
            @Parameter(hidden = true) Principal principal,
            @RequestBody AccountOperationRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.getAccountNumber());
        return accountService.getAccountBalance(principal, account);
    }

    @PostMapping("/create")
    @Operation(summary = "Request account creation", description = "Submits a request for admin approval to create a new bank account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account creation request submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid account details"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> registerAccount(
            @Parameter(hidden = true) Principal principal, 
            @RequestBody AccountCreateRequest request) {
        String accountNumber = accountService.generateAccountNumber(principal.getName(), request.getType());

        // Submit request for admin approval instead of direct creation
        return requestService.submitCreateRequest(principal, accountNumber, request.getType(), request.getInitialBalance());
    }

    @PostMapping("/delete")
    @Operation(summary = "Request account deletion", description = "Submits a request for admin approval to delete an account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account deletion request submitted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Account doesn't belong to user"),
            @ApiResponse(responseCode = "404", description = "Account not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> deleteAccount(
            @Parameter(hidden = true) Principal principal, 
            @RequestBody AccountOperationRequest request) {
        // Submit request for admin approval instead of direct deletion
        return requestService.submitDeleteRequest(principal, request.getAccountNumber());
    }
}
