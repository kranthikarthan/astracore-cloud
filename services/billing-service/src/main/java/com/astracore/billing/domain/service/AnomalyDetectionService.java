package com.astracore.billing.domain.service;

import com.astracore.domain.billing.Invoice;

public interface AnomalyDetectionService {
    boolean isAnomalous(Invoice invoice);
}
