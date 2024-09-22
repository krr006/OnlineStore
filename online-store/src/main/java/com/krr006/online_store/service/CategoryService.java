package com.krr006.online_store.service;

import com.krr006.online_store.entity.Category;
import com.krr006.online_store.entity.Product;
import com.krr006.online_store.entity.Status;
import com.krr006.online_store.exception.CategoryNotFoundException;
import com.krr006.online_store.repository.CategoryRepository;
import com.krr006.online_store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        var inactiveCategory = categoryRepository.findById(0L)
                .orElseThrow(() -> new CategoryNotFoundException(0L));

        List<Product> products = productRepository.findByCategoryId(id);
        products.forEach(product -> {
            product.setStatus(Status.INACTIVE);
            product.setCategory(inactiveCategory);
            productRepository.save(product);
        });

        categoryRepository.delete(category);
    }

    public Category updateCategory(Long id, Category updatedCategory) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        category.setName(updatedCategory.getName());
        category.setDescription(updatedCategory.getDescription());
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
