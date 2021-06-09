let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, default: 'Admin' },
});

adminSchema.pre('save', function (next) {
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

adminSchema.methods.verifyAdminPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (error, result) => {
    if (error) {
      next(error);
    } else {
      return cb(error, result);
    }
  });
};

let Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;
