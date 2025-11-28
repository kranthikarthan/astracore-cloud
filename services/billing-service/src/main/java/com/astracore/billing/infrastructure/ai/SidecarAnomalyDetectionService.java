package com.astracore.billing.infrastructure.ai;

import com.astracore.billing.domain.service.AnomalyDetectionService;
import com.astracore.domain.billing.Invoice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@ConditionalOnProperty(name = "billing.ai.enabled", havingValue = "true")
@RequiredArgsConstructor
public class SidecarAnomalyDetectionService implements AnomalyDetectionService {

    @Value("${billing.ai.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public boolean isAnomalous(Invoice invoice) {
        try {
            String url = aiServiceUrl + "/predict/anomaly";
            log.info("Calling AI Sidecar at {} for invoice: {}", url, invoice.getInvoiceId());

            // Build payload with all required fields
            Map<String, Object> payload = new HashMap<>();
            payload.put("tenant_id", "default"); // TODO: Extract from security context
            payload.put("amount", invoice.getTotalAmount().getAmount().doubleValue());
            payload.put("currency", invoice.getTotalAmount().getCurrency());
            payload.put("customer_id", invoice.getPartyIdTo());

            Map<String, Object> response = restTemplate.postForObject(url, payload, Map.class);
            
            if (response != null && response.containsKey("is_anomalous")) {
                boolean isAnomaly = (Boolean) response.get("is_anomalous");
                if (isAnomaly) {
                    log.warn("Anomaly detected for invoice: {} - Reason: {}", 
                        invoice.getInvoiceId(), 
                        response.get("reason"));
                }
                return isAnomaly;
            }
        } catch (Exception e) {
            log.error("Failed to call AI Sidecar: {}", e.getMessage(), e);
            // Fail-open: return false if AI service is down
            return false;
        }
        return false;
    }
}
