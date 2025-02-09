const express = require('express');
const db = require('./db');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const rateLimit = require('express-rate-limit');

// Initialize Express app
const app = express();
const port = 3000;
const SECRET_KEY = 'your_secret_key'; // JWT Secret Key

// Middleware
app.use(express.json());

// Rate Limiting Middleware (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per IP
  message: 'Too many requests, please try again later.',
});

app.use(limiter);

// Log metadata (store in logs.json)
async function logMetadata(metadata) {
  try {
    let logs = [];
    try {
      const data = await fs.readFile('logs.json', 'utf-8');
      logs = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is empty
    }
    logs.push(metadata);
    await fs.writeFile('logs.json', JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Error logging metadata:', err);
  }
}

// JWT Authentication Middleware
function authenticate(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Route to login and get JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Validate credentials (simple example, use a DB in real scenarios)
  if (username === 'user' && password === 'password') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// CRUD Operations

// POST /api/items - Create a new item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  db.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    // Log metadata (item creation)
    logMetadata({ action: 'create', name, description, createdAt: new Date() });
    res.status(201).json({ id: result.insertId, name, description });
  });
});

// GET /api/items - Retrieve all items
app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /api/items/:id - Retrieve a specific item by ID
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(results[0]);
  });
});

// PUT /api/items/:id - Update an item by ID
app.put('/api/items/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    // Log metadata (item update)
    logMetadata({ action: 'update', id, name, description, updatedAt: new Date() });
    res.json({ id, name, description });
  });
});

// DELETE /api/items/:id - Delete an item by ID
app.delete('/api/items/:id', authenticate, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    // Log metadata (item deletion)
    logMetadata({ action: 'delete', id, deletedAt: new Date() });
    res.status(204).send();
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
