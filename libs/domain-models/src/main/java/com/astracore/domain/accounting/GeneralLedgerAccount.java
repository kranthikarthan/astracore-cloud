package com.astracore.domain.accounting;

import com.astracore.shared.domain.AggregateRoot;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class GeneralLedgerAccount extends AggregateRoot {
    private String glAccountId;
    private String accountName;
    private String accountCode;
    private String glAccountTypeId; // Links to GlAccountType
    private String parentGlAccountId;
}
