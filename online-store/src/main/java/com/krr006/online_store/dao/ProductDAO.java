package com.krr006.online_store.dao;

import com.krr006.online_store.dto.ProductRequest;
import com.krr006.online_store.entity.Category;
import com.krr006.online_store.entity.Product;
import com.krr006.online_store.entity.Status;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Profile("dev")
@Repository("productDao")
@RequiredArgsConstructor
public class ProductDAO {

    private final SessionFactory sessionFactory;

    public Product createProduct(ProductRequest productRequest, Category category) {
        Product product = null;
        Session session = getCurrentSession();

        try {
            String hql = "INSERT INTO Product (name, description, price, category, createdAt, status) " +
                    "VALUES (:name, :description, :price, :category, :createdAt, :status)";

            var query = session.createQuery(hql);

            query.setParameter("name", productRequest.getName());
            query.setParameter("name", productRequest.getName());
            query.setParameter("description", productRequest.getDescription());
            query.setParameter("price", productRequest.getPrice());
            query.setParameter("category", category);
            query.setParameter("createdAt", LocalDateTime.now());
            query.setParameter("status", Status.ACTIVE);
            product = (Product) query.uniqueResult();

        } catch (Exception e) {
            session.getTransaction().rollback();
            System.out.println("An error occurred while creating a product");
        }

        return product;
    }

    private Session getCurrentSession() {
        Session session;

        try {
            session = sessionFactory.getCurrentSession();
        } catch (Exception e){
            session = sessionFactory.openSession();
        }
        return session;
    }




}
