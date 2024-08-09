const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://admin:!sbdDOF2021080824!@13.215.209.29:27017/DOF', {
  authSource: 'admin' // the database where the user is created
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (from root directory)
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/test', (req, res) => {
  res.send('Test endpoint is working');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Find user in database
  mongoose.connection.db.collection('users').findOne({ email, password }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Return user data including usertype as JSON
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      usertype: user.usertype
    });
  });
});

app.get('/users', (req, res) => {
  console.log('Received request for /users');
  
  mongoose.connection.db.collection('users').find({}).toArray((err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Users fetched:', users);
    res.json(users);
  });
});

// Endpoint to update user details
app.put('/updateUser', (req, res) => {
  const { id, fullname, usertype } = req.body;
  
  mongoose.connection.db.collection('users').updateOne(
    { user_id: id },
    { $set: { fullname, usertype } },
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to update user' });
      }
      if (result.modifiedCount === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, message: 'User updated successfully' });
    }
  );
});

// Endpoint to delete a user
app.delete('/deleteUser', (req, res) => {
  const { id } = req.body;

  mongoose.connection.db.collection('users').deleteOne({ user_id: id }, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});