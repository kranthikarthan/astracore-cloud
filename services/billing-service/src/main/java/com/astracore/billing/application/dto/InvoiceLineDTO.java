package com.astracore.billing.application.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class InvoiceLineDTO {
    private UUID invoiceLineId;
    private Integer invoiceItemSeqId;
    private UUID productId;
    private String description;
    private BigDecimal quantity;
    private MoneyDTO amount;
}
