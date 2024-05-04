// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Note = require('../models/note');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().lean();
    const promises = users.map(async (user) => {
      user.postCount = await Note.countDocuments({ createdBy: user._id });
      return user;
    });
    const populatedUsers = await Promise.all(promises);
    res.render('users', { users: populatedUsers, error: null });
  } catch (err) {
    console.error(err);
    res.render('error', { error: 'Error fetching users' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'User deleted successfully');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting user');
  } finally {
    res.redirect('/users');
  }
});

module.exports = router;
