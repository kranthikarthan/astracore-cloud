package com.astracore.domain.product;

import com.astracore.shared.domain.AggregateRoot;
import com.astracore.shared.domain.Money;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
public class InventoryItem extends AggregateRoot {
    private String inventoryItemId;
    private String productId;
    private String facilityId; // Warehouse ID
    private String serialNumber;
    private BigDecimal quantityOnHand;
    private Money unitCost;
}
