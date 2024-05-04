// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');

router.get('/dashboard', async (req, res) => {
  try {
    if (!req.session.user.isAdmin) {
      req.flash('error_msg', 'Unauthorized Access');
      return res.redirect('/');
    }
    const adminNotes = await Note.find({ createdBy: req.session.user._id });
    const allNotes = await Note.find();
    const totalUsers = await User.countDocuments();
    res.render('dashboard', { adminNotes, allNotes, totalUsers });
  } catch (err) {
    console.error(err);
    res.render('error', { error: 'Error fetching dashboard data' });
  }
});

module.exports = router;
