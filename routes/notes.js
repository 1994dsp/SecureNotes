// routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');


// Get all notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    const totalUsers = await User.countDocuments();
    res.render('notes', { notes, user: req.session.user, error: null, totalUsers });
  } catch (err) {
    console.error(err);
    res.render('error', { error: 'Error fetching notes' });
  }
});

// Search notes
router.get('/notes/search', async (req, res) => {
  try {
    const query = req.query.q;
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    const notes = await Note.find({ $or: [{ title: regex }, { content: regex }] });
    const totalUsers = await User.countDocuments();
    res.render('notes', { notes, user: req.session.user, error: null, totalUsers });
  } catch (err) {
    console.error(err);
    res.render('error', { error: 'Error searching notes' });
  }
});



module.exports = router;
