package com.astracore.event;

import com.astracore.shared.domain.DomainEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentReceived implements DomainEvent {
    private String tenantId;
    private String paymentId;
    private String invoiceId;
    private BigDecimal amount;
    private String currency;
    private String method;
    private Instant occurredOn;

    @Override
    public Instant occurredOn() {
        return occurredOn;
    }
}
