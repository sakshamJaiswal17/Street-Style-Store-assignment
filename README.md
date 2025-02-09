
# Street Style Store.

In this project, I developed a RESTful API using Node.js and Express.js to manage items in a MySQL database. The API supports CRUD operations, JWT-based authentication, rate limiting, and error handling. The goal was to build a secure and scalable backend and deploy it on Render


## Deployment

To deploy this project run

```bash
  npm install
```

```bash
  node server.js
```



## Authors

- Saksham Jaiswal


## Run Locally

Clone the project

```bash
  git clone https://github.com/sakshamJaiswal17/Street-Style-Store-assignment.git
```
Go to the project directory

```bash
  cd Street-Style-Store-assignment
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```


## Set up the Database:

Install MySQL (or SQLite/PostgreSQL, depending on your choice).

Create a new database (e.g., my_database) in MySQL:

```bash
  CREATE DATABASE my_database;

```
Create a table for storing items: 

```bash
  USE my_database;

  CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

```

Configure Database Connection

In your project folder, navigate to db.js (or wherever your database connection is configured). Update the connection details with your database credentials


```bash
  const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // MySQL username
  password: 'password', // MySQL password
  database: 'my_database' // Your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;

```
## API Reference

#### Login

```http
  POST http://localhost:3000/login
Content-Type: application/json

{
  "username": "user",
  "password": "password"
}

```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### create a new item

```http
  POST /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get all Items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of  item to fetch |

#### update a specific item by its ID

```http
  PUT /api/items/:id
```


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of  item to fetch |


#### delete a specific item

```http
  DELETE /api/items/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of  item to fetch |



## Database schema

| id | name     | Description                 | created_at| 
| :--| :------- | :------------------- | :---------|
| `id`|**Required**. `string`|  `text` |time of creation  |


## Final Report

### Approach

Node.js & Express : Used to handle HTTP requests and create routes for CRUD operations.

MySQL Database : Managed data storage with MySQL, connected to the app via mysql2 library.

Authentication : JWT tokens were used to authenticate users and protect routes.

Rate Limiting : Implemented rate limiting using express-rate-limit to prevent abuse.

Error Handling : Centralized middleware to catch errors and return clear messages.

Deployment : Deployed the application on Render, connecting it to a live MySQL database.

### Challenges

Database Connection : Issues connecting to the database, solved by double-checking connection settings and environment variables.

JWT Authentication : Managed token expiration and validation using jsonwebtoken.

Rate Limiting : Implemented rate limiting using express-rate-limit, ensuring fair usage.

Error Handling : Handled database, user input, and rate limit errors with middleware.

### Solutions

Used asynchronous file handling with fs.promises for metadata management.
Configured JWT token validation middleware to secure API routes.
Deployed the app with environment variables on Render for secure and scalable operation.

### Conclusion 
 
The project successfully created a fully functional and secure API, deployed on Render, with proper authentication, rate limiting, and error handling. It provided valuable insights into backend development and cloud deployment practices.
