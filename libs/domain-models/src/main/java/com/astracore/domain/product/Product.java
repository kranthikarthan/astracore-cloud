package com.astracore.domain.product;

import com.astracore.shared.domain.AggregateRoot;
import com.astracore.shared.domain.Money;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class Product extends AggregateRoot {
    private String productId;
    private String productName;
    private String description;
    private String productType; // GOOD, SERVICE
    private java.util.List<ProductPrice> prices;
}
