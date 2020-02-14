const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const Meal = require('../models/meal');

const helpers = require('../helpers/server-results');

// Handle GET request to "/meals"
router.get('/', (req, res, next) => {
  Meal.find()
    .exec()
    .then(meals => {
      res.status(200).json({
        meals: meals
      });
    })
    .catch(err => {
      helpers.internalServerError(err);
    });
});

// Handle POST request to "/meals"
router.post('/', (req, res, next) => {
  const meal = new Meal({
    _id: new mongoose.Types.ObjectId(),
    image: req.body.image,
    name: req.body.name,
    desc: req.body.desc,
    timeOfPreparation: req.body.timeOfPreparation,
    author: {
      _id: req.body.author._id,
      name: req.body.author.name,
      surname: req.body.author.surname
    }
  });

  meal
    .save()
    .then(meal => {
      res.status(201).json({
        meal: meal
      });
    })
    .catch(err => {
      helpers.internalServerError(res, err);
    });
});

// Handle GET request to specific meal
router.get('/:mealId', (req, res, next) => {
  const mealId = req.params.mealId;
  Meal.findById(mealId)
    .exec()
    .then(meal => {
      if (meal) {
        res.status(200).json({
          meal: meal
        });
      } else {
        res.status(404).json({
          message: 'Not found meal with provided ID'
        });
      }
    })
    .catch(err => {
      helpers.internalServerError(res, err);
    });
});

// Handle PUT request to specific meal
router.put('/:mealId', checkAuth, (req, res, next) => {
  const mealId = req.params.mealId;

  Meal.updateOne({ _id: mealId }, { $set: req.body })
    .exec()
    .then(response => {
      helpers.correctRequest(res, response);
    })
    .catch(err => {
      helpers.internalServerError(res, err);
    });
});

// Handle DELETE request to specific meal
router.delete('/:mealId', checkAuth, (req, res, next) => {
  Meal.remove({ _id: req.params.mealId })
    .exec()
    .then(response => {
      helpers.correctRequest(res, response);
    })
    .catch(err => {
      helpers.internalServerError(err);
    });
});

module.exports = router;
