var mongoose = require('mongoose');

var CoordSchema = new mongoose.Schema({
  tagID: {
	  type: String,
	  unique: true,
    required: true,
	  trim: true
  },
  anchorID: {
	  type: String,
	  unique: true,
    required: true,
	  trim: true
  },
  position: {
    type:
      {
        type: String,
        enum: ['MultiPoint'],
        default: 'MultiPoint',
        index: '2dsphere'
      }, 
    // "default" : [],
    coordinates: {
      type:[[Number]] 
      // [{
      //   _id: false,
      //   lon: Number, 
      //   lat: Number
      // }]
    }
  }
});

CoordSchema.set('autoIndex', false);
var Coords = mongoose.model('Coords', CoordSchema);
module.exports = Coords;
