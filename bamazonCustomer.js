let inquirer = require('inquirer');

let connectToMYSQL = require('./connectMySQL.js');

let connection = new connectToMYSQL();

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

      if (product_id.includes(id)) {
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
      connection.query(
        'SELECT stock_quantity FROM products where ?',
        { item_id: id },
        (err, res) => {
          if (err)
            return console.log('error in getting stock of the provided id');

          let inStock = res[0].stock_quantity;

          checkQuantityOfProduct(id, quantity, inStock);
        }
      );
    });
};

let checkQuantityOfProduct = (id, quantity, inStock) => {
  if (quantity > inStock) {
    console.log('Insufficient stock!');
    promptUserToOrderAgain();
  } else {
    let remainingQuantity = inStock - quantity;

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
        showTotalPrice(id, quantity);
      }
    );
  }
  3;
};

let showTotalPrice = (id, quantity) => {
  connection.query(
    'SELECT price FROM products where ?',
    { item_id: id },
    (err, res) => {
      if (err) return console.log('error in getting price of the provided id');

      let price = res[0].price;
      let totalPrice = quantity * price;
      console.log(`Total price of your product: ${totalPrice}`);
    }
  );
};

let promptUserToOrderAgain = () => {
  inquirer
    .prompt({
      name: 'orderAgain',
      type: 'list',
      message: 'Do you want to order again?',
      choices: ['YES', 'NO']
    })
    .then(answer => {
      if (answer.orderAgain === 'YES') {
        displayProducts();
      } else {
        console.log('Thank you for ordering');
      }
    });
};
displayProducts();
