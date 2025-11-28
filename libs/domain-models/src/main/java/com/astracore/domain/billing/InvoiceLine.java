package com.astracore.domain.billing;

import com.astracore.shared.domain.Money;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceLine {
    private String invoiceItemSeqId;
    private String invoiceItemTypeId; // PRODUCT_ITEM, TAX, DISCOUNT
    private String productId;
    private String description;
    private BigDecimal quantity;
    private Money amount; // Total for this line
}
