//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');

//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", // Your Username
  password: "Hub$chm!tt0816", // Your password
  database: "Bamazon_db" // Your Database
})


// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {

	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, res) {
    if (err) throw err;
    
    console.log('Welcome to BAMAZON! The Store of Endless possibilites!')
    console.log('----------------------------------------------------------------------------------------------------')
		
		for (var i = 0; i < res.length; i++) {
			console.log('ID: ' + res[i].item_id + ' | ' + 'Product: ' + res[i].product_name + ' | ' + 'Department: ' + res[i].department_name + ' | ' + 'Price: $' + res[i].price + ' | ' + 'Stock Quantity: ' + res[i].stock_quantity);
      console.log('----------------------------------------------------------------------------------------------------')
      
    
    }
	  	//Prompt the user for item/quantity they would like to purchase
	  	promptUserPurchase();
	})
}

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase
function promptUserPurchase() {

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the ID for which you would like to purchase.',
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {
    var item = input.item_id;
		var quantity = input.quantity;

		// Query db to confirm that the given item ID exists in the desired quantity
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, res) {
			if (err) throw err;

			// If the user has selected an invalid item ID, data attay will be empty
			if (res.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
				var productRes = res[0];
				// If the quantity requested by the user is in stock
				if (quantity <= productRes.stock_quantity) {
					console.log('Congratulations, the product you requested is in stock! Placing order!');

					// Construct the updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productRes.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					// console.log('updateQueryStr = ' + updateQueryStr);

					// Update the inventory
					connection.query(updateQueryStr, function(err, res) {
						if (err) throw err;

            console.log('Your order has been placed! Your total is $' + productRes.price * quantity);
            
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
					})
				} else {
          console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
          
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					displayInventory();
				}
			}
		})
  })
}

// runBamazon will execute the main application logic
function runBamazon() {
	// Display the available inventory
	displayInventory();
}

// Run the application logic
runBamazon();


