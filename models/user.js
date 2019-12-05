const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema ({

  email: String,
  password: String,
  name: String

})

userSchema.methods.passwordEncrypt = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.passwordValidation = function (password) {

  return bcrypt.compareSync(password, this.password);

};

module.exports = mongoose.model('users',userSchema);
