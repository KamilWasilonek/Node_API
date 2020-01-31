const { MONGO_DB_PASSWORD } = require('./config');
const express = require('express');
// Morgan logs incoming requests
const morgan = require('morgan');
// Allows to parse request body
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors')


const app = express();

const mealsRoutes = require('./api/routes/meals');
const userRoutes = require('./api/routes/user');

mongoose.connect(
  'mongodb+srv://admin:' +
    MONGO_DB_PASSWORD +
    '@meals-44tke.mongodb.net/API?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Set request logs
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

// Set accepted body formats
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

// Set CORS configuration
app.use((req, res, next) => {
  // Allow anyone to make request
  res.header("Access-Control-Allow-Origin", "*");

  // Set which information can be included into the header
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  // Browser will send OPTIONS before PUT or PATCH request to check possibility of making request
  if (res.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    return res.status(200).json({});
  }
  next();
});

// Set handlers for specific routes
app.use('/meals', mealsRoutes);
app.use('/user', userRoutes);

// Handle "Router not found" error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Handle any error
app.use((error, req, res, next) => {
  // error 500 - Internal server error
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

module.exports = app;
