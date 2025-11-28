package com.astracore.billing.api;

import com.astracore.billing.application.dto.InvoiceDTO;
import com.astracore.billing.application.usecase.CreateInvoiceUseCase;
import com.astracore.billing.application.usecase.GetInvoiceUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BillingController {

    private final CreateInvoiceUseCase createInvoiceUseCase;
    private final GetInvoiceUseCase getInvoiceUseCase;
    private final com.astracore.billing.application.usecase.GetInvoiceListUseCase getInvoiceListUseCase;

    @PostMapping
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        InvoiceDTO created = createInvoiceUseCase.execute(invoiceDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceDTO> getInvoice(@PathVariable UUID invoiceId) {
        InvoiceDTO invoice = getInvoiceUseCase.execute(invoiceId);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping
    public ResponseEntity<java.util.List<InvoiceDTO>> getInvoices() {
        return ResponseEntity.ok(getInvoiceListUseCase.execute());
    }
}
