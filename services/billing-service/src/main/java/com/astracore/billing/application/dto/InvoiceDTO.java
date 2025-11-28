package com.astracore.billing.application.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class InvoiceDTO {
    private UUID invoiceId;
    private String invoiceTypeId;
    private UUID partyIdFrom;
    private UUID partyIdTo;
    private String customerName;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String statusId;
    private String currencyUomId;
    private MoneyDTO totalAmount;
    private List<InvoiceLineDTO> lines;
    private Instant createdAt;
    private Instant updatedAt;
}
