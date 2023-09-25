const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// In-memory user data (for testing purposes)
const users = [];

// JWT Secret Key
const secretKey = 'innovativeRudra';

// Middleware to protect routes
function authenticate(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
    
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

// Register user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  // Check if user already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = { username, password: hashedPassword };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully' });
  console.log(users);
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid username or password' });
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid username or password' });
  // Create and return a JWT token
  const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
  res.header('Authorization', `Bearer ${token}`).json({ token });
});

// Forgot Password API 
app.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) return res.status(400).json({ message: 'User not found' });

  // Generate a reset token 
  const resetToken = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

  // Simulate sending an email with the reset token (for testing purposes)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // Gmail Credentials
      pass: 'your-email-password',
    },
});

  const mailOptions = {
    from: 'your-email@gmail.com',  // User Email Id
    to: user.username,
    subject: 'Password Reset',
    text: `Your password reset token: ${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
      res.status(500).json({ message: 'Failed to send reset email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Reset token sent to your email' });
    }
  });
});

// Update User Information using PATCH (Protected with authenticate middleware)
app.patch('/users/:username', authenticate, async (req, res) => {
    const username = req.params.username;
    const { password } = req.body;
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Hash and update the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      users[userIndex].password = hashedPassword;
    }
    res.status(200).json({ message: 'User updated successfully' });
});
  
  // Delete User (Protected with authenticate middleware)
  app.delete('/users/:username', authenticate, (req, res) => {
    const username = req.params.username;
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove the user from the array
    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
  });

  // Get all users (Protected with authenticate middleware)
  app.get('/users', authenticate, (req, res) => {

    // Omit sensitive data like passwords before sending the response
    const usersWithoutPasswords = users.map(user => ({ username: user.username }));
    res.status(200).json(usersWithoutPasswords);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
