let inquirer = require('inquirer');
let cTable = require('console.table');

let connectToMYSQL = require('./connectMySQL.js');

let connection = new connectToMYSQL();

let listMenuOptions = () => {
  inquirer
    .prompt({
      name: 'menuOptions',
      type: 'list',
      message: 'Please select one from the menu options\n',
      choices: [
        'View Product Sales by Department',
        'Create New Department',
        'exit'
      ]
    })
    .then(answer => {
      switch (answer.menuOptions) {
        case 'View Product Sales by Department':
          viewProductSalesByDepartment();
          break;

        case 'Create New Department':
          createNewDepartment();
          break;

        case 'exit':
          connection.end();
          break;
      }
    });
};

const createNewDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'department_name',
        type: 'input',
        message: 'Please provide the name of the new department'
      },
      {
        name: 'overhead_cost',
        type: 'input',
        message: 'Please provide the overhead cost'
      }
    ])
    .then(answer => {
      console.log(answer);
      let department_name = answer.department_name;
      let over_head_costs = answer.over_head_costs;
      var q = connection.query(
        'INSERT INTO departments SET ?',
        {
          department_name: department_name,
          over_head_costs: over_head_costs
        },
        (err, res) => {
          console.log(q);
          if (err) return console.log('error in adding new department');
          console.log(`New product has been added to the stock`);
        }
      );
    });
};

const viewProductSalesByDepartment = () => {
  connection.query(
    'SELECT distinct(departments.department_id),departments.department_name,departments.over_head_costs,products.product_sales,products.product_sales-departments.over_head_costs AS total_profit FROM departments  left join products on departments.department_name = products.department_name order by departments.department_id',
    (err, res) => {
      if (err) return console.log('error in searching for the products\n');

      let data = [];

      for (var i = 0; i < res.length; i++) {
        data.push([
          res[i].department_id,
          res[i].department_name,
          res[i].over_head_costs,
          res[i].product_sales,
          res[i].total_profit
        ]);
      }

      console.table(
        [
          'departmentID',
          'Name',
          'Overhead Cost',
          'Product Sales',
          'Total Profit'
        ],
        data
      );
    }
  );
};

listMenuOptions();
