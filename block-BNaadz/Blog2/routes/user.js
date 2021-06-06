let express = require('express');
let User = require('../models/user');

let router = express.Router();

router.get('/', (req, res, next) => {
  res.render('authPage');
});

router.get('/register', (req, res, next) => {
  res.render('userRegister');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (error, user) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/users/login');
    }
  });
});

router.get('/login', (req, res, next) => {
  res.render('userLogin');
});

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/users/login');
  } else {
    User.findOne({ email }, (error, user) => {
      if (error) {
        return next(error);
      } else {
        if (!user) {
          return res.redirect('/users/login');
        } else {
          user.verifyPassword(password, (error, result) => {
            if (error) {
              return next(error);
            } else if (!result) {
              return res.redirect('/users/login');
            } else {
              req.session.userId = user.id;
              res.redirect('/articles');
            }
          });
        }
      }
    });
  }
});

module.exports = router;
