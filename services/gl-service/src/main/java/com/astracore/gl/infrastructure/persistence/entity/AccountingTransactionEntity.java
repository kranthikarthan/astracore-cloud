package com.astracore.gl.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "accounting_transaction")
public class AccountingTransactionEntity extends BaseEntity {

    @Id
    @Column(name = "transaction_id")
    private UUID transactionId;

    @Column(name = "transaction_date", nullable = false)
    private Instant transactionDate;

    @Column(name = "entry_date", nullable = false)
    private Instant entryDate;

    @Column(name = "description")
    private String description;

    @Column(name = "transaction_type", nullable = false)
    private String transactionType;

    @Column(name = "is_posted", nullable = false)
    private boolean posted;

    @Column(name = "organization_party_id")
    private UUID organizationPartyId;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionEntryEntity> entries = new ArrayList<>();

    public void addEntry(TransactionEntryEntity entry) {
        entries.add(entry);
        entry.setTransaction(this);
    }
}
