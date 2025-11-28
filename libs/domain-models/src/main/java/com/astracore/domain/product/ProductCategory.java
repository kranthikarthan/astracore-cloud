package com.astracore.domain.product;

import lombok.Data;

@Data
public class ProductCategory {
    private String categoryId;
    private String categoryName;
    private String parentCategoryId; // For hierarchy
}
