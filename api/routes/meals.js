const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const Meal = require('../models/meal');

const helpers = require('../helpers/server-results');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads/');
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    callback(null, true);
  } else {
    callback(new Error('Wrong image format'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

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
router.post('/', checkAuth, upload.single('image'), (req, res, next) => {
  const meal = new Meal({
    _id: new mongoose.Types.ObjectId(),
    image: req.file.path,
    name: req.body.name,
    desc: req.body.desc
  });

  meal
    .save()
    .then(meal => {
      res.status(201).json({
        meal: meal
      });
    })
    .catch(err => {
      helpers.internalServerError(err);
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
      helpers.internalServerError(err);
    });
});

// Handle PATCH request to specific meal
router.patch('/:mealId', checkAuth, (req, res, next) => {
  const mealId = req.params.mealId;
  const updatedMeal = {};

  for (const prop of req.body) {
    updatedMeal[prop.propName] = prop.value;
  }

  Meal.updateOne({ _id: mealId }, { $set: updatedMeal })
    .exec()
    .then(response => {
      helpers.correctRequest(res, response);
    })
    .catch(err => {
      helpers.internalServerError(err);
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
