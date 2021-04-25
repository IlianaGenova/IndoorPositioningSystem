var mongoose = require('mongoose');

var CoordSchema = new mongoose.Schema({
  tagID: {
	  type: String,
    required: true,
	  trim: true
  },
  anchorID: {
	  type: String,
    required: true,
	  trim: true
  },
  distance: {
    type: Number, 
    required: true
  }
});

CoordSchema.set('autoIndex', false);
var Coords = mongoose.model('Coords', CoordSchema);
module.exports = Coords;
