let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    author: String,
  },
  { timestamps: true }
);

let Article = mongoose.model('article', articleSchema);

module.exports = Article;
