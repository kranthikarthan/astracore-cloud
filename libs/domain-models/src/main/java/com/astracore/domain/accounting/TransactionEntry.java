package com.astracore.domain.accounting;

import com.astracore.shared.domain.Money;
import lombok.Data;

@Data
public class TransactionEntry {
    private String transactionEntrySeqId;
    private String glAccountId;
    private String organizationPartyId;
    private Money amount;
    private String debitCreditFlag; // D or C
    private String description;
}
