// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/notes');
  }
  res.render('login', { error: req.flash('error_msg') });
});

module.exports = router;
