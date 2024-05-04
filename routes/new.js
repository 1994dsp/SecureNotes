// routes/new.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');

router.get('/notes/new', (req, res) => {
  res.render('new', { error: req.flash('error_msg') });
});

router.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      req.flash('error_msg', 'Please provide title and content');
      return res.redirect('/notes/new');
    }
    await Note.create({ title, content, createdBy: req.session.user._id });
    req.flash('success_msg', 'Note added successfully');
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error adding note');
    res.redirect('/notes/new');
  }
});

module.exports = router;
