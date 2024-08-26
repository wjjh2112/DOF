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
    // Determine the Content-Type based on file extension
    const ext = path.extname(fileName).toLowerCase();

    let contentType;
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else {
      throw new Error('Unsupported file type. Only JPEG and PNG are allowed.');
    }
  
    const params = {
      Bucket: 'ikanmeter',
      Key: `${folder}/${fileName}`,
      Body: fileContent,
      ContentDisposition: 'inline',
      ContentType: contentType
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
  mongoose.connection.db.collection('users').findOne({ email, password }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Return user data
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      usertype: user.usertype,
      userOrg: user.userOrg
    });
  });
});


app.get('/users', (req, res) => {
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

app.get('/get-expense-records', async (req, res) => {
  try {
      const expenseRecords = await mongoose.connection.db.collection('expenses').find({}).toArray();
      res.status(200).json(expenseRecords);
  } catch (error) {
      console.error('Error fetching expense records:', error);
      res.status(500).json({ error: 'Failed to fetch expense records' });
  }
});

app.get('/get-expense-record', async (req, res) => {
  try {
      const expenseID = req.query.id;
      const expenseRecord = await mongoose.connection.db.collection('expenses').findOne({ expenseID });

      if (expenseRecord) {
          res.status(200).json(expenseRecord);
      } else {
          res.status(404).json({ error: 'Expense record not found' });
      }
  } catch (error) {
      console.error('Error fetching expense record:', error);
      res.status(500).json({ error: 'Failed to fetch expense record' });
  }
});

app.get('/get-income-records', async (req, res) => {
  try {
      const incomeRecords = await mongoose.connection.db.collection('incomes').find({}).toArray();
      res.status(200).json(incomeRecords);
  } catch (error) {
      console.error('Error fetching income records:', error);
      res.status(500).json({ error: 'Failed to fetch income records' });
  }
});

app.get('/get-income-record', async (req, res) => {
  try {
      const incomeID = req.query.id;
      const incomeRecord = await mongoose.connection.db.collection('incomes').findOne({ incomeID });

      if (incomeRecord) {
          res.status(200).json(incomeRecord);
      } else {
          res.status(404).json({ error: 'Income record not found' });
      }
  } catch (error) {
      console.error('Error fetching income record:', error);
      res.status(500).json({ error: 'Failed to fetch income record' });
  }
});


const generateUniqueID = (prefix) => {
  const randomNum = Math.floor(100 + Math.random() * 900); // Generates a random 3-digit number
  return `${prefix}${randomNum}`;
};

app.post('/submit-expense', upload.array('expenseImages[]'), async (req, res) => {
  try {
      const expenseItem = req.body.expenseItem;
      const expenseAmount = req.body.expenseAmount;
      const expRecDateTime = new Date(req.body.expRecDateTime);
      const expCategory = req.body.expCategory;
      const remarks = req.body.remarks;

      const currentDate = new Date().toISOString().slice(0, 10);

      // Generate unique expense ID
      const expenseID = generateUniqueID('EXP');

      // Upload images to S3 and generate image keys
      const imageKeys = [];
      for (const file of req.files) {
          const imageKey = `${expenseID}_${currentDate}_${file.originalname}`;
          await uploadFileToS3(file.path, imageKey, 'expense-images');
          imageKeys.push(imageKey);
      }

      // Save expense record to database
      const newExpense = {
          expenseID,
          expenseItem,
          expenseAmount,
          expRecDateTime,
          expCategory,
          remarks,
          imageKeys
      };

      await mongoose.connection.db.collection('expenses').insertOne(newExpense);

      // Respond with success status and message
      res.status(200).json({ success: true, message: 'Expense record saved successfully!', newExpense });
  } catch (error) {
      console.error('Error saving expense record:', error);
      res.status(500).json({ success: false, error: 'Failed to save expense record' });
  }
});

app.post('/submit-income', upload.array('incomeImages[]'), async (req, res) => {
  try {
      const incomeItem = req.body.incomeItem;
      const incomeAmount = req.body.incomeAmount;
      const incomeRecDateTime = new Date(req.body.incomeRecDateTime);
      const incomeCategory = req.body.incomeCategory;
      const remarks = req.body.remarks;

      const currentDate = new Date().toISOString().slice(0, 10);

      // Generate unique income ID
      const incomeID = generateUniqueID('INC');

      // Upload images to S3 and generate image keys
      const imageKeys = [];
      for (const file of req.files) {
          const imageKey = `${incomeID}_${currentDate}_${file.originalname}`;
          await uploadFileToS3(file.path, imageKey, 'income-images');
          imageKeys.push(imageKey);
      }

      // Save income record to database
      const newIncome = {
          incomeID,
          incomeItem,
          incomeAmount,
          incomeRecDateTime,
          incomeCategory,
          remarks,
          imageKeys
      };

      await mongoose.connection.db.collection('incomes').insertOne(newIncome);

      // Respond with success status and message
      res.status(200).json({ success: true, message: 'Income record saved successfully!', newIncome });
  } catch (error) {
      console.error('Error saving income record:', error);
      res.status(500).json({ success: false, error: 'Failed to save income record' });
  }
});

const penSchema = new mongoose.Schema({
  payload: Number,
  timestamp: { type: Date, default: Date.now }
});

// Define a function to get the model dynamically
function getModel(tankPrefix, type) {
  const modelName = `${tankPrefix}_${type}`;
  return mongoose.model(modelName, penSchema, modelName);
}

function generateRandomData(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2); // Ensure data is within range and formatted
}

function storeDummyData() {
  const tanks = ['PEN1', 'PEN2', 'PEN3'];
  const types = ['PH', 'DO'];
  
  tanks.forEach(tank => {
    types.forEach(type => {
      const model = getModel(tank, type);
      const min = type === 'PH' ? 7.30 : 4.30; // Adjust as necessary
      const max = type === 'PH' ? 7.90 : 6.88; // Adjust as necessary
      const data = new model({ payload: generateRandomData(min, max) });
      data.save();
    });
  });
}

setInterval(storeDummyData, 60000); // Run every 60 seconds (1 minute)

app.get('/api/data/:logger', async (req, res) => {
  const logger = req.params.logger;
  const [tankPrefix, type] = logger.split('_');
  
  if (!tankPrefix || !type) {
    return res.status(400).send('Invalid logger format');
  }

  const model = getModel(tankPrefix, type);

  try {
    const data = await model.find().sort({ timestamp: -1 }).limit(10); // Fetch latest 10 records
    res.json(data);
  } catch (err) {
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/data', async (req, res) => {
  const { tank, startDate, endDate } = req.query;
  
  // Create an array to store promises for each tank's data
  const promises = [];

  const tanks = tank ? [tank] : ['PEN1', 'PEN2', 'PEN3'];
  tanks.forEach(tankPrefix => {
      ['DO', 'PH'].forEach(type => {
          const model = getModel(tankPrefix, type);
          const query = {};

          // Apply date filter if both startDate and endDate are provided
          if (startDate && endDate) {
              query.timestamp = {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate)
              };
          }

          // Push a promise that also includes the collection name in the result
          promises.push(
              model.find(query).sort({ timestamp: -1 }).exec().then(results => 
                  results.map(record => ({ ...record.toObject(), collection: `${tankPrefix}_${type}` }))
              )
          );
      });
  });

  try {
      const results = await Promise.all(promises);
      // Combine all the results into a single array
      const data = results.flat();
      // Sort combined results by timestamp in descending order
      data.sort((a, b) => b.timestamp - a.timestamp);
      res.json(data);
  } catch (err) {
      res.status(500).send('Error fetching data');
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});