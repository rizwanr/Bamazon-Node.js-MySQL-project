let inquirer = require('inquirer');

let connectToMYSQL = require('./connectMySQL.js');

let connection = new connectToMYSQL();

let product_id = [];

let listMenuOptions = () => {
  inquirer
    .prompt({
      name: 'menuOptions',
      type: 'list',
      message: 'Please select one from the menu options\n',
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
    if (err) return console.log('error in searching for the products\n');
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
      product_id.push(res[i].item_id);
    }
  });
};

const viewLowInventory = () => {
  connection.query(
    'SELECT * from products where stock_quantity<5',
    (err, res) => {
      if (err) return console.log('error in searching for the stock\n');
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
    }
  );
};

const addToInventory = () => {
  viewProductsForSale();
  inquirer
    .prompt({
      name: 'id',
      type: 'input',
      message: 'Please provide the ID of the item you would want add stock to:'
    })
    .then(answer => {
      let id = parseInt(answer.id);

      if (product_id.includes(id)) {
        inquirer
          .prompt({
            name: 'addStock',
            type: 'input',
            message: 'Please provide the new stock:'
          })
          .then(answer => {
            let stock = parseInt(answer.addStock);
            updateWithNewStock(id, stock);
            viewProductsForSale();
          });
      }
    });
};

let updateWithNewStock = (id, stock) => {
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: stock
      },
      {
        item_id: id
      }
    ],

    (err, res) => {
      if (err) return console.log('Error.Unable to update the record\n');
      console.log(res);
    }
  );
};

const addNewProduct = () => {};

listMenuOptions();
