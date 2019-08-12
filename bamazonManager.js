let inquirer = require('inquirer');

let connectToMYSQL = require('./connectMySQL.js');

let connection = new connectToMYSQL();

let listMenuOptions = () => {
  inquirer
    .prompt({
      name: 'menuOptions',
      type: 'list',
      message: 'Please select one from the menu options',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product',
        'exit'
      ]
    })
    .then(answer => {
      switch (answer.menuOptions) {
        case 'View Products for Sale':
          viewProductsForSale();
          break;

        case 'View Low Inventory':
          viewLowInventory();
          break;

        case 'Add to Inventory':
          addToInventory();
          break;

        case 'Add New Product':
          addNewProduct();
          break;

        case 'exit':
          connection.end();
          break;
      }
    });
};

const viewProductsForSale = () => {
  connection.query('Select * from products', (err, res) => {
    if (err) return console.log('error in searching for the products');
    for (var i = 0; i < res.length; i++) {
      console.log(
        'Id: ' +
          res[i].item_id +
          ' || Product: ' +
          res[i].product_name +
          ' || Stock: ' +
          res[i].stock_quantity +
          ' || Prices: ' +
          res[i].price
      );
    }
    connection.end();
  });
};

const viewLowInventory = () => {
  connection.query(
    'SELECT * from products where stock_quantity<5',
    (err, res) => {
      if (err) return console.log('error in searching for the stock');
      for (var i = 0; i < res.length; i++) {
        console.log(
          'Id: ' +
            res[i].item_id +
            ' || Product: ' +
            res[i].product_name +
            ' || Stock: ' +
            res[i].stock_quantity +
            ' || Prices: ' +
            res[i].price
        );
      }
      connection.end();
    }
  );
};

listMenuOptions();
