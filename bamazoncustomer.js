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
	purchase();
});


function showArray(results) {

	var productsTable = []

	for (var i = 0; i < results.length; i++) {
		productsTable.push(results[i])
	}

	return productsTable
}

function purchase() {
	// query the database for all products

	connection.query("SELECT item_id, product_name, price, stock_quantity, product_sales FROM products", function(err, results) {
		if (err) throw err;
		console.table(showArray(results))
			// once you have the products, prompt the user for which they'd like to purchase
		inquirer
			.prompt([{
				name: "product",
				type: "input",
				message: "Enter the item_id of the item you would like to purchase"
			}, {
				name: "units",
				type: "input",
				message: "How many units would you like?"
			}])
			.then(function(answer) {
				// get the ID of the chosen item
				var chosenItem;
				var total

				for (var i = 0; i < results.length; i++) {
					if (results[i].item_id === parseInt(answer.product)) {
						chosenItem = results[i];
					}
				}

				total = (answer.units * chosenItem.price)
					// determine if there is enough inventory
				if (chosenItem.stock_quantity > parseInt(answer.units)) {
					//there's enough inventory so update inventory, tell user they purchased, restart
					connection.query(
						"UPDATE products SET ? WHERE ?", [{
							stock_quantity: (chosenItem.stock_quantity - answer.units),
							product_sales: (chosenItem.product_sales + total)
						}, {
							item_id: chosenItem.item_id
						}],
						function(error) {
							if (error) throw error;
							console.log("Cool you bought that for $" + total + " dollars");
							connection.end();
						}
					);
				} else {
					// not enough inventory, tell user that
					console.log("there aren't enough of those in my stock...");
					connection.end();
				}
			});
	});
}