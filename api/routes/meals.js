const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Meal = require('../models/meal');

// Handle GET request to "/meals"
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handle GET to /meals'
  });
});

// Handle POST request to "/meals"
router.post('/', (req, res, next) => {
  const meal = new Meal({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });

  // Save meal in database
  meal
    .save()
    .then(response => {
      // Status 201 - resource created
      res.status(201).json({
        message: response,
        meal: meal,
      });
    })
    .catch(err => {
      res.error(500).json({
        error: err
      })
    });
});

// Handle GET request to specific meal
router.get('/:mealId', (req, res, next) => {
  const mealId = req.params.mealId;
  Meal.findById(mealId).exec().then(meal => {
    if(meal) {
      res.status(200).json({
        meal: meal,
      })
    } else {
      res.status(500).json({
        message: "Not found meal with provided ID"
      })
    }
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
});

// Handle PATCH request to specific meal
router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: `Update product with id ${productId}`
  });
});

// Handle DELETE request to specific meal
router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: `Delete product with id ${productId}`
  });
});

module.exports = router;
