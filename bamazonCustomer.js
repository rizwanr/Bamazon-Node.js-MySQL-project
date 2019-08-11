var mysql = require('mysql');
var inquirer = require('inquirer');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'bol12345',
  database: 'bamazon'
});

connection.connect(err => {
  if (err) return console.log(error);
  console.log('connected');
});

let product_id = [];

const displayProducts = () => {
  connection.query('Select * from products', (err, res) => {
    if (err) return console.log('error in searching for the artist');
    for (var i = 0; i < res.length; i++) {
      console.log(
        'Id: ' +
          res[i].item_id +
          ' || Product: ' +
          res[i].product_name +
          ' || Prices: ' +
          res[i].price
      );
      product_id.push(res[i].item_id);
      console.log(product_id);
    }
  });
  promptUserForID();
};

var promptUserForID = () => {
  inquirer
    .prompt({
      name: 'id',
      type: 'input',
      message: 'Please provide the ID of the item you would want to buy'
    })
    .then(answer => {
      id = parseInt(answer.id);
      debugger;
      if (product_id.includes(id)) {
        debugger;
        console.log('fuck you');
        console.log(product_id.includes(answer.id));
        promptUserForUnitOfProduct(id);
      }
    });
};

var promptUserForUnitOfProduct = id => {
  inquirer
    .prompt({
      name: 'unit',
      type: 'input',
      message: 'Please provide the quantity of item you want to purchase'
    })
    .then(answer => {
      connection.query(
        'SELECT stock_quantity FROM products where ?',
        { item_id: id },
        (err, res) => {
          if (err)
            return console.log('error in getting stock of the provided id');
          checkInStock();
          console.log(res);
        }
      );
    });
};

var checkInStock = () => {};

displayProducts();
