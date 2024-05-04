// routes/delete.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');

router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      req.flash('error_msg', 'Note not found');
    } else {
      req.flash('success_msg', 'Note deleted successfully');
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting note');
  } finally {
    res.redirect('/notes');
  }
});

module.exports = router;
