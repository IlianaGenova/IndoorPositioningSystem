var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
	password: {
		type: String
	},
	main_admin: {
		type: Boolean
	}
});

AdminSchema.statics.authenticate = function (email, password, callback) {
  Admin.findOne({ email: email })
    .exec(function (err, admin) {
      if (err) {
        return callback(err)
      } else if (!admin) {
        var err = new Error('Admin not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, admin.password, function (err, result) {
        if (result === true) {
          return callback(null, admin);
        } else {
          return callback();
        }
      })
    });
}

AdminSchema.pre('save', function (next) {
	console.log("kakvo")
  var admin = this;
  bcrypt.hashSync(admin.password, bcrypt.genSaltSync(10), function (err, hash) {
    if (err) {
			console.log("0")
      return next(err);
    }

    admin.password = hash;
		console.log("1")
    next();
		console.log("2")
  })
});

AdminSchema.set('autoIndex', false);
var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
