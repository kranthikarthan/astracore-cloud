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

    /**
     * Mark this invoice as issued and register a domain event.
     *
     * @param tenantId the tenant to which this invoice belongs
     */
    public void markIssued(String tenantId) {
        com.astracore.domain.billing.InvoiceIssuedEvent event = new com.astracore.domain.billing.InvoiceIssuedEvent(
                tenantId,
                this.invoiceId,
                this.partyIdTo,
                this.totalAmount != null ? this.totalAmount.getAmount() : null,
                this.totalAmount != null && this.totalAmount.getCurrency() != null
                        ? this.totalAmount.getCurrency().getCurrencyCode()
                        : this.currencyUomId,
                this.invoiceDate,
                this.dueDate,
                Instant.now()
        );
        registerEvent(event);
    }
}
