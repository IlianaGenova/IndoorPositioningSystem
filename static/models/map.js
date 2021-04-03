var mongoose = require('mongoose');

var MapSchema = new mongoose.Schema({
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
