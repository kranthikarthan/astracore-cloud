package com.astracore.gl.messaging;

import com.astracore.event.InvoiceIssued;
import com.astracore.gl.application.service.GlPostingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceIssuedListener {

    private final GlPostingService glPostingService;

    @KafkaListener(topics = "invoice.issued.v1", groupId = "gl-service")
    public void onInvoiceIssued(InvoiceIssued event) {
        log.info("Received InvoiceIssued event for invoice {} with amount {} {}",
                event.getInvoiceId(), event.getTotalAmount(), event.getCurrency());
        glPostingService.postInvoice(event);
    }
}
