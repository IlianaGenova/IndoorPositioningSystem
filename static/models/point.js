var mongoose = require('mongoose');

var PointSchema = new mongoose.Schema({
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

PointSchema.set('autoIndex', false);
var Point = mongoose.model('Point', PointSchema);
module.exports = Point;
