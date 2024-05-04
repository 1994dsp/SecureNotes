// routes/edit.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');

router.get('/notes/:id/edit', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      req.flash('error_msg', 'Note not found');
      return res.redirect('/notes');
    }
    res.render('edit', { note, error: req.flash('error_msg') });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error finding note');
    res.redirect('/notes');
  }
});

router.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content });
    if (!note) {
      req.flash('error_msg', 'Note not found');
      return res.redirect('/notes');
    }
    req.flash('success_msg', 'Note updated successfully');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating note');
  } finally {
    res.redirect('/notes');
  }
});

module.exports = router;
