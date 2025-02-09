const mysql = require('mysql2');

// Configure database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Your MySQL username
  password: 'Saksham@1706', // Your MySQL password
  database: 'my_database' // Database name
});

connection.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

module.exports = connection;
