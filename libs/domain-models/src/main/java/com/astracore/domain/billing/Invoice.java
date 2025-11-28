package com.astracore.domain.billing;

import com.astracore.shared.domain.AggregateRoot;
import com.astracore.shared.domain.Money;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
public class Invoice extends AggregateRoot {
    private String invoiceId;
    private String invoiceTypeId; // SALES_INVOICE, PURCHASE_INVOICE
    private String partyIdFrom; // Biller
    private String partyIdTo; // Payer
    private String customerName; // Customer Name
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String statusId; // IN_PROCESS, APPROVED, SENT, PAID
    private String currencyUomId;
    private List<InvoiceLine> lines;
    private Money totalAmount;
}
