let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true },
    city: String,
  },
  { timestamps: true }
);

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

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (error, result) => {
    return cb(error, result);
  });
};

let User = mongoose.model('user', userSchema);

module.exports = User;
