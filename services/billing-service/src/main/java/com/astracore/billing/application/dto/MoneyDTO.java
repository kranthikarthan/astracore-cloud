package com.astracore.billing.application.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MoneyDTO {
    private BigDecimal amount;
    private String currency;
}
