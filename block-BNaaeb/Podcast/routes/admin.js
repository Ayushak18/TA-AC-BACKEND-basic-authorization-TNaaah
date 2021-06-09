let express = require('express');
let Admin = require('../models/admin');

let router = express.Router();

router.get('/', (req, res, next) => {
  res.render('adminLogin');
});

router.get('/adminRegister', (req, res, next) => {
  res.render('adminRegister');
});

router.post('/adminRegister', (req, res, next) => {
  Admin.create(req.body, (error, admin) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/admin/adminLogin');
    }
  });
});

router.get('/adminLogin', (req, res, next) => {
  res.render('adminLoginForm');
});

router.post('/adminLogin', (req, res, next) => {
  let { email, password } = req.body;
  if (email && password) {
    Admin.findOne({ email }, (error, admin) => {
      if (error) {
        next(error);
      } else {
        if (admin) {
          admin.verifyAdminPassword(password, (error, result) => {
            if (error) {
              next(error);
            } else {
              if (result) {
                req.session.adminId = admin.id;
                res.send('Session created');
              } else {
                res.redirect('/admin/adminLogin');
              }
            }
          });
        } else {
          res.redirect('/admin/adminLogin');
        }
      }
    });
  } else {
    res.redirect('/admin/adminLogin');
  }
});

module.exports = router;
