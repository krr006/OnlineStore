package com.krr006.online_store.service;

import com.krr006.online_store.dto.ProductRequest;
import com.krr006.online_store.entity.Product;
import com.krr006.online_store.entity.Status;
import com.krr006.online_store.exception.CategoryNotFoundException;
import com.krr006.online_store.exception.ProductNotFoundException;
import com.krr006.online_store.repository.CategoryRepository;
import com.krr006.online_store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Product createProduct(ProductRequest productRequest) {

        var category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(productRequest.getCategoryId()));

        return productRepository.save(Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .category(category)
                .createdAt(LocalDateTime.now())
                .status(Status.ACTIVE)
                .build());
    }

    public void deleteProduct(Long id){
        var product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, ProductRequest productRequest) {
        var product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        if (productRequest.getName() != null) {
            product.setName(productRequest.getName());
        }

        if (productRequest.getDescription() != null) {
            product.setDescription(productRequest.getDescription());
        }

        if (productRequest.getPrice() != null) {
            product.setPrice(productRequest.getPrice());
        }

        if (productRequest.getCategoryId() != null) {
            var category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(productRequest.getCategoryId()));
            product.setCategory(category);
        }

        return productRepository.save(product);

    }

    public List<Product> searchProducts(String name, Long categoryId, Double minPrice, Double maxPrice) {
        return productRepository.findByFilters(name, categoryId, minPrice, maxPrice);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

}
