package com.astracore.billing.application.usecase;

import com.astracore.billing.application.dto.InvoiceDTO;
import com.astracore.billing.application.mapper.InvoiceMapper;
import com.astracore.billing.infrastructure.persistence.entity.InvoiceEntity;
import com.astracore.billing.infrastructure.persistence.repository.InvoiceRepository;
import com.astracore.domain.billing.Invoice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateInvoiceUseCase {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final com.astracore.billing.domain.service.AnomalyDetectionService anomalyDetectionService;

    @Transactional
    public InvoiceDTO execute(InvoiceDTO inputDTO) {
        // 1. Map DTO to Domain
        Invoice domainInvoice = invoiceMapper.toDomain(inputDTO);

        // 2. Business Logic / Validation (Stubbed for now)
        // e.g., validatePartyExists(domainInvoice.getPartyIdFrom());
        if (domainInvoice.getInvoiceId() == null) {
            domainInvoice.setInvoiceId(UUID.randomUUID().toString());
        }

        // 3. Map Domain to Entity
        InvoiceEntity entity = invoiceMapper.toEntity(domainInvoice);
        
        // Ensure bidirectional relationship for lines
        // Ensure bidirectional relationship for lines
        if (entity.getLines() != null) {
            entity.getLines().forEach(line -> {
                line.setInvoice(entity);
                if (line.getInvoiceLineId() == null) {
                    line.setInvoiceLineId(UUID.randomUUID());
                }
            });
        }

        // 4. AI Anomaly Check
        boolean isAnomaly = anomalyDetectionService.isAnomalous(domainInvoice);
        if (isAnomaly) {
            // For now, we just log it. In future, we might set status to REQUIRES_REVIEW
            // domainInvoice.setStatusId("REQUIRES_REVIEW"); 
            // entity.setStatusId("REQUIRES_REVIEW");
            System.out.println("WARNING: Anomaly detected for invoice " + domainInvoice.getInvoiceId());
        }

        // 5. Save
        InvoiceEntity savedEntity = invoiceRepository.save(entity);

        // 6. Map back to Domain then DTO
        Invoice savedDomain = invoiceMapper.toDomain(savedEntity);
        return invoiceMapper.toDTO(savedDomain);
    }
}
