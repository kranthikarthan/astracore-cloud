package com.astracore.domain.accounting;

import lombok.Data;

@Data
public class GlAccountType {
    private String glAccountTypeId;
    private String parentTypeId; // Hierarchy
    private String description; // ASSET, CURRENT_ASSET, CASH_EQUIVALENT
}
