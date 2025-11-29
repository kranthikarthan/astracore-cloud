package com.astracore.domain.billing;

import com.astracore.shared.domain.DomainEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Domain-level event raised when an invoice is issued.
 * This is translated to an integration event (Kafka) in the billing service.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceIssuedEvent implements DomainEvent {

    private String tenantId;
    private String invoiceId;
    private String customerId;
    private BigDecimal totalAmount;
    private String currency;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private Instant occurredOn;

    @Override
    public Instant occurredOn() {
        return occurredOn;
    }
}
