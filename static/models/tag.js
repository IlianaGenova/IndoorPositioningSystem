var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
  tagID: {
	  type: String,
	  unique: true,
	  trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});

TagSchema.set('autoIndex', false);
var Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;
