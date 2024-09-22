package com.krr006.online_store.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Long categoryId;
//    private String status;
}
