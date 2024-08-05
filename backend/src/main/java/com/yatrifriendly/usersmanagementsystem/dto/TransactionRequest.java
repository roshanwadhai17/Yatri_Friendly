package com.yatrifriendly.usersmanagementsystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionRequest {
    private String date;
    private double amount;
    private String transactionId;
}
