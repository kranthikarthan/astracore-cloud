package com.astracore.event;

import com.astracore.shared.domain.DomainEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceIssued implements DomainEvent {
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
