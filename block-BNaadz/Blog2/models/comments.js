let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    comment: String,
    articleId: {
      type: Schema.Types.ObjectId,
    },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true }
);

let Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
