import express from 'express';
import User from '../models/users_schema.js';

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in a user
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add multiple users
router.post('/bulk', async (req, res) => {
  try {
    const newUsers = req.body;
    const result = await User.insertMany(newUsers);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding bulk users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
