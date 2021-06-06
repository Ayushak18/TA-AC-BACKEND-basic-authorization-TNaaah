let express = require('express');
let router = express.Router();
let Article = require('../models/articles');
let Comment = require('../models/comments');
let auth = require('../middlewares/auth');

// Routes without login access

router.get('/', (req, res) => {
  Article.find({}, (error, articles) => {
    if (error) {
      next(error);
    } else {
      res.render('articles', { articles: articles });
    }
  });
});

router.get('/new', auth.checkLogin, (req, res, next) => {
  res.render('newArticle');
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id)
    .populate('comments')
    .populate('author', 'firstName lastName')
    .exec((error, data) => {
      if (error) {
        next(error);
      } else {
        res.render('singleArticle', { article: data });
      }
    });
});

// Adding middleware for checking whether user is logged in or not
router.use(auth.checkLogin);

// Routes with login access

// router.get('/new', (req, res, next) => {
//   res.render('newArticle');
// });

router.post('/new', (req, res, next) => {
  req.body.author = req.user.id;
  Article.create(req.body, (error, article) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/articles');
    }
  });
});

// router.get('/:id', (req, res, next) => {
//   let id = req.params.id;
//   Article.findById(id)
//     .populate('comments')
//     .exec((error, data) => {
//       if (error) {
//         next(error);
//       } else {
//         res.render('singleArticle', { article: data });
//       }
//     });
// });

router.get('/:id/edit', auth.ownerArticleCheck, (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (error, article) => {
    if (error) {
      next(error);
    } else {
      res.render('articleEdit', { article: article });
    }
  });
});

router.post('/:id', auth.ownerArticleCheck, (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (error, article) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/articles/' + article.id);
    }
  });
});

router.get('/:id/delete', auth.ownerArticleCheck, (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndRemove(id, (error, article) => {
    if (error) {
      next(error);
    } else {
      Comment.remove({ articleId: article.id }, (error, comment) => {
        if (error) {
          next(error);
        } else {
          res.redirect('/articles');
        }
      });
    }
  });
});

router.post('/:id/comment', (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  req.body.author = req.user.id;
  Comment.create(req.body, (error, comment) => {
    if (error) {
      next(error);
    } else {
      Article.findByIdAndUpdate(
        id,
        { $push: { comments: comment.id } },
        (error, data) => {
          if (error) {
            next(error);
          } else {
            res.redirect('/articles/' + id);
          }
        }
      );
    }
  });
});

module.exports = router;
