let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let podcastSchema = new Schema({
  title: String,
  type: String,
  description: String,
});

let Podcast = mongoose.model('podcast', podcastSchema);

module.exports = Podcast;
