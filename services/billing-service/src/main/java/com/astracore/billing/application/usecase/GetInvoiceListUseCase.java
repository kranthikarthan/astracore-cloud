package com.astracore.billing.application.usecase;

import com.astracore.billing.application.dto.InvoiceDTO;
import com.astracore.billing.application.mapper.InvoiceMapper;
import com.astracore.billing.infrastructure.persistence.entity.InvoiceEntity;
import com.astracore.billing.infrastructure.persistence.repository.InvoiceRepository;
import com.astracore.domain.billing.Invoice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetInvoiceListUseCase {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    @Transactional(readOnly = true)
    public List<InvoiceDTO> execute() {
        List<InvoiceEntity> entities = invoiceRepository.findAll();
        return entities.stream()
                .map(invoiceMapper::toDomain)
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
    }
}
