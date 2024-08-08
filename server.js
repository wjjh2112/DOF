const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://adminDOF:!sbdDOF2021080824!@13.215.209.29:27017/DOF', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'DOF' // the database where the user is created
}).then(() => {
  console.log('Connected to MongoDB DOF');
}).catch(err => {
  console.error('Failed to connect to MongoDB DOF', err);
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
