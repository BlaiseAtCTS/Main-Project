package com.site.banking.controller;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.dto.TransferRequest;
import com.site.banking.dto.AccountOperationRequest;
import com.site.banking.dto.AccountCreateRequest;
import com.site.banking.model.Account;
import com.site.banking.model.User;
import com.site.banking.model.UserPrincipal;
import com.site.banking.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/account")
@Tag(name = "Account Management", description = "APIs for account operations including deposits, withdrawals, and balance inquiries")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {
    @Autowired
    private AccountService accountService;
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
    @Operation(summary = "Create new account", description = "Creates a new bank account for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid account details"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> registerAccount(
            @Parameter(hidden = true) Principal principal, 
            @RequestBody AccountCreateRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.getAccountNumber());
        account.setBalance(request.getInitialBalance());
        account.setType(request.getType());
        return accountService.createAccount(principal, account);
    }

    @PostMapping("/delete")
    @Operation(summary = "Delete account", description = "Deletes the specified account (only by account owner)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Account doesn't belong to user"),
            @ApiResponse(responseCode = "404", description = "Account not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> deleteAccount(
            @Parameter(hidden = true) Principal principal, 
            @RequestBody AccountCreateRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.getAccountNumber());
        return accountService.deleteAccount(principal, account);
    }
}
