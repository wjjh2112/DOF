app.post('/registerUser', (req, res) => {
    console.log('Registration request received');
    const { firstname, lastname, email, password, token } = req.body;
  
    mongoose.connection.db.collection('users').findOne({ email }, (err, existingUser) => {
      if (err) {
        console.error('Error checking existing email:', err);
        res.json({ success: false, message: 'Error checking existing email.' });
        return;
      }
  
      if (existingUser) {
        res.json({ success: false, message: 'Email already registered.' });
        return;
      }
  
      console.log('Checking registration token');
      mongoose.connection.db.collection('registrationLinks').findOne({ token }, (err, link) => {
        if (err || !link) {
          console.error('Invalid or expired registration link:', err);
          res.json({ success: false, message: 'Invalid or expired registration link.' });
          return;
        }
  
        if (link.used || new Date() > link.expiryDate) {
          res.json({ success: false, message: 'Registration link has expired or already been used.' });
          return;
        }
  
        console.log('Registering new user');
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
            console.error('Error registering user:', err);
            res.json({ success: false, message: 'Error registering user.' });
          } else {
            mongoose.connection.db.collection('registrationLinks').updateOne({ token }, { $set: { used: true } }, (err, updateResult) => {
              if (err) {
                console.error('Error updating registration link status:', err);
                res.json({ success: false, message: 'Error updating registration link status.' });
              } else {
                console.log('User registered successfully');
                res.json({ success: true });
              }
            });
          }
        });
      });
    });
  });
  