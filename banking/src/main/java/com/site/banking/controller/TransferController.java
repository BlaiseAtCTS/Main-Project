package com.site.banking.controller;

import com.site.banking.model.Transfer;
import com.site.banking.service.TransferService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/transfers") // not sure if it is right
public class TransferController {
    private TransferService transferService;

    @PostMapping
    public ResponseEntity<Transfer> createTransfer(@RequestBody Map<String, Object> payload) {
        String fromAccount = payload.get("fromAccountNumber").toString();
        String toAccount = payload.get("toAccountNumber").toString();
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());

        Transfer newTransfer = transferService.performTransfer(fromAccount, toAccount, amount);
        return ResponseEntity.ok(newTransfer);
    }
}
