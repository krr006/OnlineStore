# 

## Описание

Это веб-приложение разработано с использованием `Spring Boot` и `React`. Оно позволяет клиентам регистрироваться, авторизовываться и просматривать продукты, а администраторы могут управлять как продуктами, так и категориями. Для аутентификации используется `ROLE_USER` и `ROLE_ADMIN`, что предоставляет различные уровни доступа к функциональности приложения.

## Основные функции

- Пользователи (с ролью `ROLE_USER`) могут просматривать продукты.
- Администраторы (с ролью `ROLE_ADMIN`) могут управлять продуктами и категориями.
- Администраторы имеют доступ к странице редактирования категорий.

## Технические требования

### Backend
- Java 17
- Spring Boot
- Maven
- PostgreSQL

### Frontend
- Node.js 18.x
- React

## Инструкция по развёртыванию

### 1. Подготовка окружения

#### Установите необходимые инструменты:

1. **Java 17**: Убедитесь, что Java 17 установлена на вашей машине.

2. **Maven**: Убедитесь, что Apache Maven установлен.

3. **PostgreSQL**: Установите `PostgreSQL` для хранения данных пользователей.

4. **Node.js и npm**: Установите `Node.js` версии 18 и выше.

## SQL запросы для создания таблиц

```sql
CREATE TABLE category (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE product (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
    id BIGINT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);
