let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, default: 'User' },
  member: { type: String, required: true },
});

userSchema.pre('save', function (next) {
  if (this.password) {
    bcrypt.hash(this.password, 10, (error, hashedPassword) => {
      if (error) {
        next(error);
      } else {
        this.password = hashedPassword;
        next();
      }
    });
  }
});

userSchema.methods.verifyUserPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (error, result) => {
    if (error) {
      next(error);
    } else {
      return cb(error, result);
    }
  });
};

let User = mongoose.model('user', userSchema);

module.exports = User;
