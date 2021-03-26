var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var AdminSchema = new mongoose.Schema({
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

AdminSchema.set('autoIndex', false);
var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
