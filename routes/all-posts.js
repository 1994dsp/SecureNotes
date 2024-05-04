// routes/all-posts.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');

router.get('/all-posts', async (req, res) => {
  try {
    const allNotes = await Note.find();
    res.render('all-posts', { allNotes });
  } catch (err) {
    console.error(err);
    res.render('error', { error: 'Error fetching posts' });
  }
});

module.exports = router;
