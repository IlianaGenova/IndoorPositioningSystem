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
  }
});

MapSchema.set('autoIndex', false);
var Map = mongoose.model('Map', MapSchema);
module.exports = Map;
