const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://adminDOF:!sbdDOF2021080824!@13.215.209.29:27017/DOF', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'DOF'
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

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to fetch all users
app.get('/users', (req, res) => {
    mongoose.connection.db.collection('users').find({}).toArray((err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(users);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
