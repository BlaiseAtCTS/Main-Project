package com.site.banking.controller;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.dto.GetTransactionsDto;
import com.site.banking.dto.TransferRequest;
import com.site.banking.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/transaction")
@Tag(name = "Transaction Management", description = "APIs for money transfers and transaction operations")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transfer")
    @Operation(summary = "Transfer money", description = "Transfers money from source account to destination account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transfer successful"),
            @ApiResponse(responseCode = "400", description = "Invalid transfer details or insufficient funds"),
            @ApiResponse(responseCode = "404", description = "Source or destination account not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDto> transferAmount(@RequestBody TransferRequest transferRequest) {
        return transactionService.transferAmount(transferRequest);
    }

    @GetMapping("/get-transactions")
    public ResponseEntity<ApiResponseDto> getTransactions(@RequestBody GetTransactionsDto transactionsDto) {
        return transactionService.getTransactions(transactionsDto);
    }
}
