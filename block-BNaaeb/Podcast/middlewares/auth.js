let Admin = require('../models/admin');
let User = require('../models/user');

module.exports = {
  verify: (req, res, next) => {
    if (req.session) {
      if (req.session.adminId) {
        let adminId = req.session.adminId;
        Admin.findById(adminId, (error, admin) => {
          if (error) {
            return next(error);
          } else {
            if (admin) {
              console.log('Admin Found');
              req.admin = admin;
              res.locals.admin = admin;
              console.log(req.admin);
              return next();
            } else {
              req.admin = null;
              res.locals.admin = null;
              return next();
            }
          }
        });
      } else if (req.session.userId) {
        let userId = req.session.userId;
        User.findById(userId, (error, user) => {
          if (error) {
            return next(error);
          } else {
            if (user) {
              console.log('User Found');
              req.user = user;
              res.locals.user = user;
              console.log(req.user);
              return next();
            } else {
              req.user = null;
              res.null.user = null;
              return next();
            }
          }
        });
      } else {
        console.log(req.session);
        console.log('No Admin and User Found');
        // res.redirect('/');
        return next();
      }
    } else {
      console.log('No session present');
      //   res.redirect('/');
      return next();
    }
  },

  authLogin: (req, res, next) => {
    if (req.session && (req.session.adminId || req.session.userId)) {
      next();
    } else {
      res.redirect('/');
    }
  },

  freeUser: (req, res, next) => {
    if (req.user.id) {
      User.findById(req.user.id, (error, user) => {
        if (error) {
          next(error);
        } else {
          if (user.member === 'premium') {
            next();
          } else {
            res.redirect('/podcast');
          }
        }
      });
    } else if (req.admin.id) {
      // console.log('UD', req.admin);
      Admin.findById(req.admin.id, (error, user) => {
        if (error) {
          next(error);
        } else {
          next();
        }
      });
    } else {
      res.redirect('/');
    }
  },
  vipUser: (req, res, next) => {
    if (req.admin.id) {
      Admin.findById(req.admin.id, (error, user) => {
        if (error) {
          next(error);
        } else {
          next();
        }
      });
    } else if (req.user.id) {
      User.findById(req.user.id, (error, user) => {
        if (error) {
          next(error);
        } else {
          if (user.member === 'vip') {
            next();
          } else {
            res.redirect('/podcast');
          }
        }
      });
    } else {
      res.redirect('/');
    }
  },

  premiumUser: (req, res, next) => {
    if (req.user.id) {
      User.findById(req.user.id, (error, user) => {
        if (error) {
          next(error);
        } else {
          if (user.member === 'premium') {
            next();
          } else {
            res.redirect('/podcast');
          }
        }
      });
    } else if (req.admin.id) {
      Admin.findById(req.admin.id, (error, user) => {
        if (error) {
          next(error);
        } else {
          next();
        }
      });
    } else {
      res.redirect('/');
    }
  },
};
