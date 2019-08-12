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
          artistSearch();
          break;

        case 'View Low Inventory':
          multiSearch();
          break;

        case 'Add to Inventory':
          rangeSearch();
          break;

        case 'Add New Product':
          songSearch();
          break;

        case 'exit':
          connection.end();
          break;
      }
    });
};

listMenuOptions();
