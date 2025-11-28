package com.astracore.domain.product;

import com.astracore.shared.domain.Money;
import lombok.Data;

import java.time.Instant;

@Data
public class ProductPrice {
    private String productPriceId;
    private String productId;
    private String productPriceTypeId; // LIST_PRICE, PROMO_PRICE, WHOLESALE_PRICE
    private String productPricePurposeId; // PURCHASE, SALE
    private String currencyUomId;
    private String productStoreGroupId; // _NA_ for global
    private Instant fromDate;
    private Instant thruDate;
    private Money price;
}
