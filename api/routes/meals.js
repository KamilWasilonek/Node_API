const express = require('express');
const router = express.Router();

// Handle GET request to "/meals"
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handle GET to /meals'
  });
});

// Handle POST request to "/meals"
router.post('/', (req, res, next) => {
  const meal = {
    // bodyParser allows to use body property
    name: req.body.name, 
  }
  // Status 201 - resource created
  res.status(201).json({
    message: 'Handle POST to /meals'
  });
});

// Handle GET request to specific meal
router.get('/:productId', (req, res, next) => {
  const productId = req.params.productId;
  res.status(200).json({
    message: `Return product with id ${productId}`,
    id: id
  });
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
