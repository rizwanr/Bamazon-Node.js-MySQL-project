let mysql = require('mysql');
function connectToMYSQL() {
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
    console.log('connection');
  });
  return connection;
}

module.exports = connectToMYSQL;
