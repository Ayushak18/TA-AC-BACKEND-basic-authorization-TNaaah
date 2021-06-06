let User = require('../models/user');
let Article = require('../models/articles');
let Comment = require('../models/comments');

module.exports = {
  checkLogin: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    let userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, 'firstName lastName', (error, user) => {
        if (error) {
          next(error);
        } else {
          req.user = user;
          res.locals.user = user;
          next();
        }
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },

  ownerArticleCheck: (req, res, next) => {
    let currentUser = req.user.id;
    let articleId = req.params.id;
    Article.findById(articleId, (error, data) => {
      if (error) {
        next(error);
      } else {
        if (data.author == currentUser) {
          next();
        } else {
          res.redirect('/articles');
        }
      }
    });
  },

  ownerCommentCheck: (req, res, next) => {
    let currentUser = req.user.id;
    let commentId = req.params.id;
    Comment.findById(commentId, (error, data) => {
      if (error) {
        next(error);
      } else {
        if (data.author == currentUser) {
          next();
        }
        else {
          res.redirect('/articles');
        }
      }
    });
  },
};
