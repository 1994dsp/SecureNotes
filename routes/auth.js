// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Note = require('../models/note');
const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('register', { error: req.flash('error_msg') });
});

router.post('/register', 
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  async (req, res, next) => {
    const { username, password, isAdmin } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array().map(error => error.msg).join('. '));
      return res.redirect('/register');
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, password: hashedPassword, isAdmin });
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', err.message);
      res.redirect('/register');
    }
});

router.post('/login', 
  body('username').trim().notEmpty().withMessage('Username must not be empty'),
  body('password').notEmpty().withMessage('Password must not be empty'),
  async (req, res, next) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array().map(error => error.msg).join('. '));
      return res.redirect('/');
    }
    try {
      const user = await User.findOne({ username });
      if (!user) {
        req.flash('error_msg', 'Username not found');
        return res.redirect('/');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash('error_msg', 'Invalid password');
        return res.redirect('/');
      }
      req.session.user = user;
      if (user.isAdmin) {
        return res.redirect('/dashboard');
      } else {
        return res.redirect('/notes');
      }
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Login error');
      res.redirect('/');
    }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/my-posts', async (req, res) => {
    try {
      const myPosts = await Note.find({ createdBy: req.session.user._id });
      res.render('my-posts', { myPosts });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error fetching posts');
      res.redirect('/dashboard');
    }
  });

  router.get('/all-posts', async (req, res) => {
    try {
      const myPosts = await Note.find({ createdBy: req.session.user._id });
      res.render('notes', { myPosts });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error fetching posts');
      res.redirect('/dashboard');
    }
  });

module.exports = router;
