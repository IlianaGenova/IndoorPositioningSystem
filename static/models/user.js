var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
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
	notes: {
		type: String,
	  trim: true
	}
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


UserSchema.set('autoIndex', false);
var User = mongoose.model('User', UserSchema);
module.exports = User;
