# bamazon


##Overview

Bamazon is a series of node CLI appplications that use SQL to query the Bamazon database and retrieve, udpate, or post data. It has three separate applications, one for customers, one for managers, and one for supervisors.

###Customer Interface
[![asciicast](https://asciinema.org/a/qRgIcruC87VMRQjuZYanJ2Tnf.png)](https://asciinema.org/a/qRgIcruC87VMRQjuZYanJ2Tnf)

`bamazoncustomer.js` first displays a table of all available products and then prompts the user to enter the item_id of the product they would like to purchase as well as the quantity. The application then updates the Bamazon products database, depletes the stock_quantity of that item, and updates that items total_sales.

###Manager Interface
[![asciicast](https://asciinema.org/a/RgSe5E7SOs7a6A2UsIBiIJFtw.png)](https://asciinema.org/a/RgSe5E7SOs7a6A2UsIBiIJFtw)

`bamazonmanager.js` first prompts the user to enter what they would like to do with the app. The four options and what they do are as follows:

	* View Products For Sale
		* Shows the entire list of products for sale.
	* View Low Inventory
		* Shows products with inventory less than 20.
	* Add To Inventory
		* Adds more inventory to a specific product.
	* Add New Product
		* Adds a new product to the products table.

###Supervisor Interface
[![asciicast](https://asciinema.org/a/RXNxrKD0PX6b2fUK1UmPjUVbx.png)](https://asciinema.org/a/RXNxrKD0PX6b2fUK1UmPjUVbx)

`bamazonsupervisor.js` first prompts the user to enter what they would like to do with the app. The 2 options and what they do are as follows:
	
	* View Product Sales By Department
		* Shows a table with the following columns:
			* department_id: the ID of the department
			* department_name: the name of the department
			* over_head_costs: the overhead costs of the department
			* product sales: the total sales of all the products in that department
			* total profit: the profit calculated from the difference of over_head_costs and product_sales
	* Create A New Department
		* Allows the user to create a new department in the departments table