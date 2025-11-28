package com.astracore.domain.party;

import com.astracore.shared.domain.AggregateRoot;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = false)
public class PartyRelationship extends AggregateRoot {
    private String partyIdFrom;
    private String partyIdTo;
    private String roleTypeIdFrom;
    private String roleTypeIdTo;
    private String relationshipType; // EMPLOYMENT, SUPPLIER_REL, CUSTOMER_REL
    private Instant fromDate;
    private Instant thruDate;
}
