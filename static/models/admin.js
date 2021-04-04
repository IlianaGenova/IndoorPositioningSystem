var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var AdminSchema = new mongoose.Schema({
  name: {
	  type: String,
	  trim: true
  },
  surname: {
	  type: String,
	  trim: true
  },
	email: {
	  type: String,
	  unique: true,
	  trim: true
  },
	phone: {
	  type: String,
	  unique: true,
	  trim: true
  },
	main_admin: {
		type: Boolean
	}
});

AdminSchema.set('autoIndex', false);
var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
