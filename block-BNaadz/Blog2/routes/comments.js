let express = require('express');
let router = express.Router();
let Article = require('../models/articles');
let Comment = require('../models/comments');
let auth = require('../middlewares/auth');

router.use(auth.checkLogin);

router.get('/:id', auth.ownerCommentCheck, (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (error, comment) => {
    if (error) {
      next(error);
    } else {
      res.render('commentEdit', { comment: comment });
    }
  });
});

router.post('/:id',auth.ownerCommentCheck, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (error, comment) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/articles/' + comment.articleId);
    }
  });
});

router.get('/:id/delete',auth.ownerCommentCheck, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndRemove(id, (error, comment) => {
    if (error) {
      next(error);
    } else {
      Article.findByIdAndUpdate(
        comment.articleId,
        { $pull: { comments: id } },
        (error, article) => {
          if (error) {
            next(error);
          } else {
            res.redirect('/articles/' + comment.articleId);
          }
        }
      );
    }
  });
});

// router.get('/:id/delete', (req, res, next) => {
//   let id = req.params.id;
//   Comment.findByIdAndRemove(id, (error, comment) => {
//     if (error) {
//       next(error);
//     } else {
//       Article.findByIdAndUpdate(
//         comment.articeId,
//         { $pull: { comments: id } },
//         (error, article) => {
//           if (error) {
//             next(error);
//           } else {
//             res.redirect('/articles/' + comment.articleId);
//           }
//         }
//       );
//     }
//   });
// });

module.exports = router;
