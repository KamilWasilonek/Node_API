const express = require('express');
// Morgan logs incoming requests
const morgan = require('morgan');
// Allows to parse request body
const bodyParser = require("body-parser")

const app = express();

const mealsRoutes = require('./api/routes/meals');

app.use(morgan('dev'));

// Set accepted body formats
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set handlers for specific routes
app.use('/meals', mealsRoutes);

// Handle "Router not found" error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Handle any error
app.use((error, req,res,next) => {
  // error 500 - Internal server error
  res.status(error.status || 500);
  res.json({
    message: error.message
  })
});

module.exports = app;
