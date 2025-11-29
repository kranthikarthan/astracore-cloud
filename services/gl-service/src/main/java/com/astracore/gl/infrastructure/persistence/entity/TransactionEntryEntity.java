package com.astracore.gl.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "transaction_entry")
public class TransactionEntryEntity extends BaseEntity {

    @Id
    @Column(name = "transaction_entry_id")
    private UUID transactionEntryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private AccountingTransactionEntity transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gl_account_id", nullable = false)
    private GeneralLedgerAccountEntity glAccount;

    @Column(name = "organization_party_id")
    private UUID organizationPartyId;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "debit_credit_flag", nullable = false, length = 1)
    private String debitCreditFlag; // "D" or "C"

    @Column(name = "description")
    private String description;
}
