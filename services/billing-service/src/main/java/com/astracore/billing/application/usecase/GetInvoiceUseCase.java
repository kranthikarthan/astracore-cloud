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
public class GetInvoiceUseCase {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    @Transactional(readOnly = true)
    public InvoiceDTO execute(UUID invoiceId) {
        InvoiceEntity entity = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + invoiceId));

        Invoice domain = invoiceMapper.toDomain(entity);
        return invoiceMapper.toDTO(domain);
    }
}
