package com.astracore.domain.party;

import lombok.Data;

@Data
public class PartyRole {
    private String roleType; // CUSTOMER, VENDOR, EMPLOYEE
    private Party party;
    private String fromDate;
    private String thruDate;
}
