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
				"View product sales by department",
				"Create a new department"
			],
			message: "What would you like to do?"
		}])
		.then(function(answer) {
			// console.log(answer.choice)
			if (answer.choice === "View product sales by department") {
				viewByDep()
			} else if (answer.choice === "Create a new department") {
				addDep()
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

function viewByDep(){
	query = "SELECT department_id, departments.department_name,"
		+ "departments.over_head_costs, products.product_sales,"
		+ "(departments.over_head_costs - products.product_sales) as total_profit"
		+ " FROM (SELECT department_name, SUM(product_sales) as product_sales"
		+ " FROM products GROUP BY department_name) as products"
		+ " INNER JOIN departments"
		+ " ON departments.department_name = products.department_name;"
	connection.query(query, function(err, results) {
		if (err) throw err;
		console.table(showArray(results))
		connection.end();
	})
}

function addDep(){
	connection.query("SELECT * FROM departments", function(err, results) {
		if (err) throw err;
		inquirer
			.prompt([{
				name: "departmentName",
				type: "input",
				message: "What is the name of the department you'd like to add?"
			},
			{
				name: "departmentCosts",
				type: "input",
				message: "What are the overhead costs for that department?",
				validate: function(value){
					if (isNaN(value) === false){
						return true
					}
					return false
				}
			}])
			.then(function(answer) {
				connection.query(
					"INSERT INTO departments SET ?", 
					{
						department_name: answer.departmentName,
						over_head_costs: parseInt(answer.departmentCosts)
					},
					function(error) {
						if (error) throw error;
						console.log("Cool you added " + answer.departmentName + " to the departments table." );
						connection.end();
					}
				);
			})
	})	
}