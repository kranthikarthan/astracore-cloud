package com.astracore.domain.order;

import com.astracore.shared.domain.AggregateRoot;
import com.astracore.shared.domain.Money;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = false)
public class SalesOrder extends AggregateRoot {
    private String orderId;
    private String orderName;
    private Instant orderDate;
    private String partyId; // Customer
    private Money grandTotal;
    private String statusId; // CREATED, APPROVED, COMPLETED
}
