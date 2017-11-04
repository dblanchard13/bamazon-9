USE bamazon

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100),
	price INT NOT NULL,
	stock_quantity INT,
	PRIMARY KEY(item_id)
	)