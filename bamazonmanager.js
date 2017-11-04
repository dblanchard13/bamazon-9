var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	initialPrompt();
});

function initialPrompt() {
	inquirer
		.prompt([{
			name: "choice",
			type: "rawlist",
			choices: [
				"View Products for sale",
				"View low inventory",
				"Add to Inventory",
				"Add New Product"
			],
			message: "What would you like to do?"
		}])
		.then(function(answer) {
			// console.log(answer.choice)
			if (answer.choice === "View Products for sale") {
				viewProducts()
			} else if (answer.choice === "View low inventory") {
				lowInventory()
			} else if (answer.choice === "Add to Inventory") {
				addInventory()
			} else if (answer.choice === "Add New Product") {
				addProduct()
			} else {
				console.log("Sorry, that was not a valid choice")
			}
		});
}


function showArray(results) {

	var productsTable = []

	for (var i = 0; i < results.length; i++) {
		productsTable.push(results[i])
	}

	return productsTable
}

function viewProducts() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		console.table(showArray(results))
		connection.end();
	})
}

function lowInventory() {
	connection.query("SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 20", function(err, results) {
		if (err) throw err;
		console.table(showArray(results))
		connection.end();
	})
}

function addInventory() {

	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		console.table(showArray(results))
		inquirer
			.prompt([{
				name: "productChoice",
				type: "input",
				message: "Enter the item_id of the product you'd like to add inventory to."
			}, {
				name: "quantity",
				type: "input",
				message: "And how many of them would you like to add?"
			}])
			.then(function(answer) {
				var chosenItem;

				for (var i = 0; i < results.length; i++) {
					if (results[i].item_id === parseInt(answer.productChoice)) {
						chosenItem = results[i];
					}
				}
				connection.query(
					"UPDATE products SET ? WHERE ?", [{
						stock_quantity: (chosenItem.stock_quantity + parseInt(answer.quantity))
					}, {
						item_id: chosenItem.item_id
					}],
					
					function(error) {
						if (error) throw error;
						console.log("Cool you added " + answer.quantity + chosenItem.product_name);
						connection.end();
					}
				);
			})
	})
}

function addProduct(){
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		inquirer
			.prompt([{
				name: "productName",
				type: "input",
				message: "What is the name of the product you'd like to add"
			},
			{
				name: "departmentName",
				type: "input",
				message: "What department should that be under?"
			},
			{
				name: "price",
				type: "input",
				message: "And how much should each unit cost?",
				validate: function(value){
					if (isNaN(value) === false){
						return true
					}
					return false
				}
			},
			{
				name: "quantity",
				type: "input",
				message: "And how many of them would you like to stock?",
				validate: function(value){
					if (isNaN(value) === false){
						return true
					}
					return false
				}
			}])
			.then(function(answer) {
				connection.query(
					"INSERT INTO products SET ?", 
					{
						stock_quantity: parseInt(answer.quantity),
						product_name: answer.productName,
						price: parseInt(answer.price),
						department_name: answer.departmentName
					},
					function(error) {
						if (error) throw error;
						console.log("Cool you added " + answer.quantity + " " + answer.productName +"s at $" + answer.price + " dollars each." );
						connection.end();
					}
				);
			})
	})	
}