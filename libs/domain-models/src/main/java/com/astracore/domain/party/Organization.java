package com.astracore.domain.party;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Organization extends Party {
    private String organizationName;
    private String taxId; // EIN, VAT, GST
    private String legalStructure; // LLC, Corp, etc.
}
