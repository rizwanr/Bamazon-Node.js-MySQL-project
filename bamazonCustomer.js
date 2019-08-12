let mysql = require('mysql');
let inquirer = require('inquirer');

// create the connection information for the sql database
let connection = mysql.createConnection({
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

let displayProducts = () => {
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
    }
  });
  promptUserForID();
};

let promptUserForID = () => {
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

let promptUserForUnitOfProduct = id => {
  inquirer
    .prompt({
      name: 'unit',
      type: 'input',
      message: 'Please provide the quantity of item you want to purchase'
    })
    .then(answer => {
      let quantity = parseInt(answer.unit);
      console.log(quantity);
      connection.query(
        'SELECT stock_quantity FROM products where ?',
        { item_id: id },
        (err, res) => {
          console.log(res);

          if (err)
            return console.log('error in getting stock of the provided id');

          let inStock = res[0].stock_quantity;
          console.log(inStock);
          checkQuantityOfProduct(id, quantity, inStock);
        }
      );
    });
};

let checkQuantityOfProduct = (id, quantity, inStock) => {
  if (quantity > inStock) return 'Insufficient quantity!';
  let remainingQuantity = inStock - quantity;
  console.log(remainingQuantity);
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: remainingQuantity
      },
      {
        item_id: id
      }
    ],

    (err, res) => {
      if (err) return console.log('Error.Unable to update the record');
    }
  );
};

displayProducts();

//Once the update goes through, show the customer the total cost of their purchase.
