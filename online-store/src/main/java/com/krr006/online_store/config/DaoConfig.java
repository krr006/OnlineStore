package com.krr006.online_store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

@Configuration
public class DaoConfig {

    @Bean
    public LocalSessionFactoryBean sessionFactory() {
        LocalSessionFactoryBean sessionFactoryBean = new LocalSessionFactoryBean();
        sessionFactoryBean.setPackagesToScan("com.krr006.online_store.entity");

        return sessionFactoryBean;

    }

}
