const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');

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

AWS.config.update({ region: 'ap-southeast-1' });

const s3 = new AWS.S3();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to upload file to S3
const uploadFileToS3 = (filePath, fileName, folder) => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: 'ikanmeter',
        Key: `${folder}/${fileName}`,
        Body: fileContent,
        ContentDisposition: 'inline'
    };

    return s3.upload(params).promise()
        .then(data => {
            // Delete the file from local after upload
            fs.unlinkSync(filePath);
            return data.Location; // Return the S3 URL
        })
        .catch(err => {
            console.error('Error uploading file:', err);
            throw err;
        });
};

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

// Endpoint to generate a registration link
app.post('/generateLink', (req, res) => {
  const { token, expiryDays, role } = req.body;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));

  mongoose.connection.db.collection('registrationLinks').insertOne({
    token,
    role,
    expiryDate,
    used: false
  }, (err, result) => {
    if (err) {
      res.json({ success: false, message: 'Error generating link.' });
    } else {
      res.json({ success: true });
    }
  });
});

// Function to generate a unique user ID
function generateUserId() {
  return 'U' + uuidv4();
}

// Endpoint to register a new user
app.post('/registerUser', (req, res) => {
  const { firstname, lastname, email, password, token } = req.body;

  mongoose.connection.db.collection('users').findOne({ email }, (err, existingUser) => {
    if (err) {
      res.json({ success: false, message: 'Error checking existing email.' });
      return;
    }

    if (existingUser) {
      res.json({ success: false, message: 'Email already registered.' });
      return;
    }

    mongoose.connection.db.collection('registrationLinks').findOne({ token }, (err, link) => {
      if (err || !link) {
        res.json({ success: false, message: 'Invalid or expired registration link.' });
        return;
      }

      if (link.used || new Date() > link.expiryDate) {
        res.json({ success: false, message: 'Registration link has expired or already been used.' });
        return;
      }

      const newUser = {
        user_id: generateUserId(),
        firstname,
        lastname,
        email,
        password,
        usertype: link.role
      };

      mongoose.connection.db.collection('users').insertOne(newUser, (err, result) => {
        if (err) {
          res.json({ success: false, message: 'Error registering user.' });
        } else {
          mongoose.connection.db.collection('registrationLinks').updateOne({ token }, { $set: { used: true } }, (err, updateResult) => {
            if (err) {
              res.json({ success: false, message: 'Error updating registration link status.' });
            } else {
              res.json({ success: true });
            }
          });
        }
      });
    });
  });
});

app.post('/submit-expense', upload.array('reportImages', 10), async (req, res) => {
  try {
      const expenseItem = req.body.expenseItem;
      const expenseAmount = req.body.expenseAmount;
      const expRecDateTime = req.body.expRecDateTime;
      const expCategory = req.body.expCategory;
      const remarks = req.body.remarks;

      // Upload images to S3
      const imageUrls = [];
      for (const file of req.files) {
          const s3Url = await uploadFileToS3(file.path, file.originalname, 'expense-images');
          imageUrls.push(s3Url);
      }

      // Save expense record to database along with the image URLs
      const newExpense = {
          expenseItem,
          expenseAmount,
          expRecDateTime,
          expCategory,
          remarks,
          imageUrls
      };

      // Assume you have a MongoDB model named Expense
      await mongoose.connection.db.collection('expenses').insertOne(newExpense);

      res.status(200).send({ message: 'Expense record saved successfully!', newExpense });
  } catch (error) {
      console.error('Error saving expense record:', error);
      res.status(500).send({ error: 'Failed to save expense record' });
  }
});

app.post('/submit-income', upload.array('reportImages', 10), async (req, res) => {
  try {
      const incomeItem = req.body.incomeItem;
      const incomeAmount = req.body.incomeAmount;
      const incomeRecDateTime = req.body.incomeRecDateTime;
      const incomeCategory = req.body.incomeCategory;
      const remarks = req.body.remarks;

      // Upload images to S3
      const imageUrls = [];
      for (const file of req.files) {
          const s3Url = await uploadFileToS3(file.path, file.originalname, 'income-images');
          imageUrls.push(s3Url);
      }

      // Save income record to database along with the image URLs
      const newExpense = {
          incomeItem,
          incomeAmount,
          incomeRecDateTime,
          incomeCategory,
          remarks,
          imageUrls
      };

      // Assume you have a MongoDB model named Income
      await mongoose.connection.db.collection('incomes').insertOne(newIncome);

      res.status(200).send({ message: 'Income record saved successfully!', newIncome });
  } catch (error) {
      console.error('Error saving income record:', error);
      res.status(500).send({ error: 'Failed to save income record' });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});