CREATE DATABASE bamazon;
USE bamazon;

create table products (
	item_id MEDIUMINT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    product_price DECIMAL(8,2) NOT NULL,
    qty INT,
    PRIMARY	KEY (item_id));
    
INSERT INTO products (product_name, department_name, product_price, qty) VALUES
    ('bagels','bakery',2.15,50),
    ('lemon_squares','bakery',2.00,34),
    ('art_frames','local',1.00,12),
    ('printed_art','local',40.00,20),
    ('oranges','farm',.50,113),
    ('fresh_dozen_eggs','farm',5.00,56),
    ('yoga_mats','local',3.00,23),
    ('coffee per pound','farm',7.00,42);