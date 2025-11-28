package com.astracore.domain.party;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class TelecommunicationsNumber extends ContactMechanism {
    private String countryCode;
    private String areaCode;
    private String contactNumber;
}
