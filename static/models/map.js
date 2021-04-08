var mongoose = require('mongoose');

var MapSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  file: {
	  type: Buffer
  },
  fileType: {
	  type: String
  },
  fileName: {
    type: String
  },
  // TODO ifn not jpg or jpeg dont add 
  active: {
    type: Boolean
  }
});

MapSchema.set('autoIndex', false);
var Map = mongoose.model('Map', MapSchema);
module.exports = Map;
