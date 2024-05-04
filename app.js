// app.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const helmetCsp = require('helmet-csp'); // Import helmet-csp
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const notesRoute = require('./routes/notes');
const newRoute = require('./routes/new');
const editRoute = require('./routes/edit');
const deleteRoute = require('./routes/delete');
const dashboardRoute = require('./routes/dashboard'); // Add the new route
const allPostsRoute = require('./routes/all-posts');
const usersRouter = require('./routes/users');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/node-express-mongodb-crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Session cookie will only be sent over HTTPS
    httpOnly: true, // Session cookie will not be accessible from client-side scripts
    sameSite: 'strict', // Session cookie will only be sent on same-site requests
    maxAge: 24 * 60 * 60 * 1000 // Session timeout set to 24 hours
  }
}));

app.use(flash());
app.use(methodOverride('_method'));
app.use(helmet());
app.use(helmetCsp());
app.use(mongoSanitize());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', notesRoute);
app.use('/', newRoute);
app.use('/', editRoute);
app.use('/', deleteRoute);
app.use('/', dashboardRoute);
app.use('/', allPostsRoute); 
app.use(usersRouter);


const PORT = process.env.PORT || 3000;

// HTTPS configuration
const options = {
  key: fs.readFileSync('/Users/apple/Documents/Secure Web Development/node-express-mongodb-crud/SecureNotes/server.key'),
  cert: fs.readFileSync('/Users/apple/Documents/Secure Web Development/node-express-mongodb-crud/SecureNotes/server.cert')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
