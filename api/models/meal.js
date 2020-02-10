const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  image: String,
  name: { type: String, required: true },
  desc: { type: String, required: true },
  timeOfPreparation: { type: String, required: true },
  author: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
  }
});

module.exports = mongoose.model('Meal', mealSchema, 'Meals');
