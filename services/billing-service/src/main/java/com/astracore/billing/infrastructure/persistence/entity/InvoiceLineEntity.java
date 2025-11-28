package com.astracore.billing.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "invoice_line")
public class InvoiceLineEntity extends BaseEntity {

    @Id
    @Column(name = "invoice_line_id")
    private UUID invoiceLineId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private InvoiceEntity invoice;

    @Column(name = "invoice_item_seq_id", nullable = false)
    private Integer invoiceItemSeqId;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "description")
    private String description;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "amount")
    private BigDecimal amount;
}
