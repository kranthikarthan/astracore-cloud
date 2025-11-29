package com.astracore.billing.infrastructure.messaging;

import com.astracore.billing.domain.service.DomainEventPublisher;
import com.astracore.domain.billing.InvoiceIssuedEvent;
import com.astracore.event.InvoiceIssued;
import com.astracore.shared.domain.DomainEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaDomainEventPublisher implements DomainEventPublisher {

    private static final String INVOICE_ISSUED_TOPIC = "invoice.issued.v1";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void publish(List<DomainEvent> events) {
        if (events == null || events.isEmpty()) {
            return;
        }

        for (DomainEvent event : events) {
            if (event instanceof InvoiceIssuedEvent invoiceIssuedEvent) {
                publishInvoiceIssued(invoiceIssuedEvent);
            } else {
                log.debug("Ignoring unsupported domain event type: {}", event.getClass().getName());
            }
        }
    }

    private void publishInvoiceIssued(InvoiceIssuedEvent event) {
        InvoiceIssued payload = new InvoiceIssued(
                event.getTenantId(),
                event.getInvoiceId(),
                event.getCustomerId(),
                event.getTotalAmount(),
                event.getCurrency(),
                event.getIssueDate(),
                event.getDueDate(),
                event.getOccurredOn()
        );

        log.info("Publishing InvoiceIssued event to topic {} for invoice {}", INVOICE_ISSUED_TOPIC, event.getInvoiceId());
        kafkaTemplate.send(INVOICE_ISSUED_TOPIC, event.getInvoiceId(), payload);
    }
}
