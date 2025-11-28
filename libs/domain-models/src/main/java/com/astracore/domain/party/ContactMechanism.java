package com.astracore.domain.party;

import com.astracore.shared.domain.AggregateRoot;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public abstract class ContactMechanism extends AggregateRoot {
    private String contactMechanismId;
    private String contactMechanismType; // POSTAL_ADDRESS, TELECOM_NUMBER, EMAIL_ADDRESS
}
