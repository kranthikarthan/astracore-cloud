package com.astracore.domain.accounting;

import com.astracore.shared.domain.AggregateRoot;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
public class AccountingTransaction extends AggregateRoot {
    private String transactionId;
    private Instant transactionDate;
    private Instant entryDate;
    private String description;
    private String transactionType; // SALES_INVOICE, PAYMENT, ADJUSTMENT
    private boolean isPosted; // Has this hit the balances?
    private List<TransactionEntry> entries;
    private String organizationPartyId; // The company this transaction belongs to
}
