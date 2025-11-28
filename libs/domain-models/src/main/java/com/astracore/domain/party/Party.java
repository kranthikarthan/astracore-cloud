package com.astracore.domain.party;

import com.astracore.shared.domain.AggregateRoot;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public abstract class Party extends AggregateRoot {
    private String partyId;
    private String externalId; // For legacy system mapping
    private java.util.List<ContactMechanism> contactMechanisms;
}
