package com.astracore.billing.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "invoice")
public class InvoiceEntity extends BaseEntity {

    @Id
    @Column(name = "invoice_id")
    private UUID invoiceId;

    @Column(name = "invoice_type_id", nullable = false)
    private String invoiceTypeId;

    @Column(name = "party_id_from", nullable = false)
    private UUID partyIdFrom;

    @Column(name = "party_id_to", nullable = false)
    private UUID partyIdTo;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "status_id", nullable = false)
    private String statusId;

    @Column(name = "currency_uom_id", nullable = false)
    private String currencyUomId;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceLineEntity> lines = new ArrayList<>();

    public void addLine(InvoiceLineEntity line) {
        lines.add(line);
        line.setInvoice(this);
    }
}
