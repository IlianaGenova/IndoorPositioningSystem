var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var AnchorSchema = new mongoose.Schema({
  anchorID: {
	  type: String,
	  unique: true,
	  trim: true
  },
  position: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  }
});

AnchorSchema.set('autoIndex', false);
var Anchor = mongoose.model('Anchor', AnchorSchema);
module.exports = Anchor;
