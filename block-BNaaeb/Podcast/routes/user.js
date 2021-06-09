let express = require('express');
let router = express.Router();
let User = require('../models/user');

router.get('/', (req, res, next) => {
  res.render('userLogin');
});

router.get('/userRegister', (req, res, next) => {
  res.render('userRegisterForm');
});

router.post('/userRegister', (req, res, next) => {
  User.create(req.body, (error, user) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/user/userLogin');
    }
  });
});

router.get('/userLogin', (req, res, next) => {
  res.render('userLoginForm');
});

router.post('/userLogin', (req, res, next) => {
  let { email, password, member } = req.body;
  if (email && password) {
    User.findOne({ email, member }, (error, user) => {
      if (error) {
        next(error);
      } else {
        if (user) {
          user.verifyUserPassword(password, (error, result) => {
            if (error) {
              next(error);
            } else {
              if (result) {
                req.session.userId = user.id;
                res.send('Session Created');
              } else {
                res.redirect('/user/userLogin');
              }
            }
          });
        } else {
          res.redirect('/user/userLogin');
        }
      }
    });
  } else {
    res.redirect('/user/userLogin');
  }
});

module.exports = router;
