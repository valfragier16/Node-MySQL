DROP DATABASE IF EXISTS Bamazon_db;

CREATE DATABASE Bamazon_db;

USE Bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fujifilm Instant Camera", "Electronics", 61.99, 47);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "Electronics", 299.99, 26);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone Xs", "Electronics", 999.99, 21);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Galaxy S9", "Electronics", 719.99,  72);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gucci Denim Jacket", "Apparel", 5280.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Surface Pro", "Electroics", 899.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lawn Mower", "Tools", 79.99, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Magnolia Table", "Books", 17.99, 11);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("MacBook Pro", "Electronics", 1199.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox One X", "Electronics", 499.99, 13);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Super Smash Bros.", "Games", 44.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PetChatz", "Pet Supplies", 419.99, 4);

SELECT * FROM products;


CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NULL,
    over_head_costs DECIMAL(10,2) NULL,
    product_sales  DECIMAL(10,2) NULL,
    total_profit DECIMAL(10,2) NULL,
    PRIMARY KEY(department_id)
);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ('ELECTRONICS', 20000.00, 34000.00),
    ('APPAREL', 1200.00, 1500.00),
    ('TOOLS', 1400.00, 1700.00),
    ('BOOKS', 2000.00, 2100.00),
    ('GAMES', 100.00, 250.00), 
    ('PET SUPPLIES', 900.00, 2300.00);