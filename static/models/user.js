var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  name: {
	  type: String,
	  unique: true,
	  trim: true
  },
  surname: {
	  type: String,
	  unique: true,
	  trim: true
  },
  
});

UserSchema.set('autoIndex', false);
var User = mongoose.model('User', UserSchema);
module.exports = User;
