const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const helpers = require('../helpers/server-results');

// Handle POST request to "/user/signup"
router.post('/signup', (req, res, next) => {
  const email = req.body.email.toLowerCase().trim();
  User.find({ email: email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email exists'
        });
      } else if (req.body.password.length < 5) {
        return res.status(409).json({
          message: 'Password is to short (min required length is 5)'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            helpers.internalServerError(res, err);
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email.toLowerCase(),
              password: hash
            });
            user
              .save()
              .then(() => {
                res.status(201).json({
                  user: user
                });
              })
              .catch(err => {
                helpers.internalServerError(res, err);
              });
          }
        });
      }
    })
    .catch(err => {
      helpers.internalServerError(res, err);
    });
});

// Handle POST request to "/user/login"
router.post('/login', (req, res, next) => {
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password.trim();
  User.find({ email: email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return helpers.authFailed(res);
      }
      bcrypt.compare(
        password,
        user[0].password,
        (err, result) => {
          if (err) {
            helpers.authFailed(res);
          }
          if (result) {
            const token = jwt.sign(
              {
                id: user[0].id,
                email: user[0].email
              },
              process.env.JWT_KEY,
              {
                expiresIn: '7d'
              }
            );
            return res.status(200).json({
              message: 'Auth successful',
              token: token
            });
          }
          helpers.authFailed(res);
        }
      );
    })
    .catch(err => {
      helpers.internalServerError(res, err);
    });
});

// Handle POST request to "/user/findUser"
router.post('/findUser', (req, res, next) => {
  const email = req.body.email.toLowerCase().trim();
  User.find({ email: email })
    .exec()
    .then(user => {
      return res.status(200).json({
        user: user
      });
    })
    .catch(err => {
      helpers.internalServerError(res, err);
    });
});

module.exports = router;
