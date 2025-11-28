package com.astracore.domain.party;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PostalAddress extends ContactMechanism {
    private String toName;
    private String attentionName;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String stateProvinceGeoId;
    private String postalCode;
    private String countryGeoId;
}
