package com.krr006.online_store.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Long id) {
        super("Category with id=" + id + " not found");
    }
}
