package com.astracore.billing.infrastructure.ai;

import com.astracore.billing.domain.service.AnomalyDetectionService;
import com.astracore.domain.billing.Invoice;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@ConditionalOnProperty(name = "billing.ai.enabled", havingValue = "false", matchIfMissing = true)
public class NoOpAnomalyDetectionService implements AnomalyDetectionService {

    @Override
    public boolean isAnomalous(Invoice invoice) {
        log.debug("AI Anomaly Detection is disabled. Skipping check for invoice: {}", invoice.getInvoiceId());
        return false;
    }
}
