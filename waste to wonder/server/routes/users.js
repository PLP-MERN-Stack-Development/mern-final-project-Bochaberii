const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get users by type (producer or consumer)
router.get('/users/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['producer', 'consumer'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be "producer" or "consumer"'
      });
    }

    const users = await User.find({ userType: type }).select('-__v');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get single user by Clerk ID
router.get('/user/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId }).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// Clerk webhook endpoint to sync users
router.post('/webhook/clerk', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'user.created') {
      // Create new user in MongoDB
      const newUser = new User({
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        username: data.username || data.email_addresses[0].email_address.split('@')[0],
        firstName: data.first_name,
        lastName: data.last_name,
        userType: data.unsafe_metadata?.userType || 'consumer',
        profileImage: data.profile_image_url
      });

      await newUser.save();
      
      res.json({
        success: true,
        message: 'User created successfully'
      });
    } else if (type === 'user.updated') {
      // Update user in MongoDB
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          email: data.email_addresses[0].email_address,
          username: data.username || data.email_addresses[0].email_address.split('@')[0],
          firstName: data.first_name,
          lastName: data.last_name,
          profileImage: data.profile_image_url,
          updatedAt: Date.now()
        }
      );

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } else if (type === 'user.deleted') {
      // Delete user from MongoDB
      await User.findOneAndDelete({ clerkId: data.id });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      res.json({
        success: true,
        message: 'Webhook received'
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error',
      error: error.message
    });
  }
});

module.exports = router;
