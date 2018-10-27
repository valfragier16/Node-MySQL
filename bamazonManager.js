//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');

//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", // You Username
  password: "Hub$chm!tt0816", // Your Password
  database: "Bamazon_db" // Your Database
})

// allow user to use arrow keys (up and down) to select from list 
function start(){
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","End Session"]
  }]).then(function(ans){
     switch(ans.doThing){
      case "View Products for Sale": viewProducts();
      break;
      case "View Low Inventory": viewLowInventory();
      break;
      case "Add to Inventory": addToInventory();
      break;
      case "Add New Product": addNewProduct();
      break;
      case "End Session": console.log('Bye!');
    }
  });
}

//views all inventory
function viewProducts(){
  console.log('>>>>>>Viewing Products<<<<<<');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  
  console.log('----------------------------------------------------------------------------------------------------')

  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
    
    console.log('--------------------------------------------------------------------------------------------------')
  }

  start();
  });
}

//views inventory lower than 5
function viewLowInventory(){
  console.log('>>>>>>Viewing Low Inventory<<<<<<');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log('----------------------------------------------------------------------------------------------------')

  for(var i = 0; i<res.length;i++){
    // set minimum inventory quantity to display items that are below 5
    if(res[i].stock_quantity <= 5){
    console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
    
    console.log('--------------------------------------------------------------------------------------------------');
    }
  }

  start();
  });
}




//displays prompt to add more of an item to the store and asks how much
function addToInventory(){
  console.log('>>>>>>Adding to Inventory<<<<<<');
  connection.query('SELECT * FROM Products', function(err, res){
    if(err) throw err;
    var itemArray = [];
    //pushes each item into an itemArray
    for(var i=0; i<res.length; i++){
      itemArray.push(res[i].product_name);
    }
  
    inquirer.prompt([
      {
        type: "list",
        name: "product",
        choices: itemArray,
        message: "Which item would you like to add inventory?"
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to add?',

      }
  ]).then(function(input) {
      var item = input.item_id;
      var addQuantity = input.quantity;
  
      // Query db to confirm that the given item ID exists and to determine the current stock_count
      var queryStr = 'SELECT * FROM products WHERE ?';
  
      connection.query(queryStr, {item_id: item}, function(err, res) {
        if (err) throw err;
  
        // If the user has selected an invalid item ID, data attay will be empty
        // console.log('data = ' + JSON.stringify(data));
  
        if (res.length === 0) {
          console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
          addToInventory();
  
        } else {
          var productRes = res[0];
  
          // console.log('productData = ' + JSON.stringify(productData));
          // console.log('productData.stock_quantity = ' + productData.stock_quantity);
  
          console.log('Updating Inventory...');
  
          // Construct the updating query string
          var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productRes.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
          // console.log('updateQueryStr = ' + updateQueryStr);
  
          // Update the inventory
          connection.query(updateQueryStr, function(err, res) {
            if (err) throw err;
  
            console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productRes.stock_quantity + addQuantity) + '.');
            console.log("\n---------------------------------------------------------------------\n");
  
            // End the database connection
            connection.end();
          })
        }
      })
    })
  })
}



// allows manager to add a completely new product to store
function addNewProduct(){
  console.log('>>>>>>Adding New Product<<<<<<');
  var deptNames = [];

  // grab name of departments
  connection.query('SELECT * FROM Departments', function(err, res){
    if(err) throw err;
    for(var i = 0; i<res.length; i++){
      deptNames.push(res[i].department_name);
    }
  })

  inquirer.prompt([{
    type: "input",
    name: "product",
    message: "Product: ",
    validate: function(value){
      if(value){return true;}
      else{return false;}
    }
  }, {
    type: "list",
    name: "department",
    message: "Department: ",
    choices: deptNames
  }, {
    type: "input",
    name: "price",
    message: "Price: ",
    validate: function(value){
      if(isNaN(value) === false){return true;}
      else{return false;}
    }
  }, {
    type: "input",
    name: "quantity",
    message: "Quantity: ",
    validate: function(value){
      if(isNaN(value) == false){return true;}
      else{return false;}
    }
  }]).then(function(ans){
    connection.query('INSERT INTO Products SET ?',{
      ProductName: ans.product,
      DepartmentName: ans.department,
      Price: ans.price,
      StockQuantity: ans.quantity
    }, function(err, res){
      if(err) throw err;
      console.log('Another item was added to the store.');
    })
    start();
  });
}

start();
