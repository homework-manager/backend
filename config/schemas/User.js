const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const passwords = require('../../utils/passwords.js')

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  fullname: String,
  email: String
})

userSchema.methods.changePassword = async function (password) {
  this.password = await passwords.hashPassword(password)
}

userSchema.methods.getPublicData = function () {
  return {
    username: this.username,
    fullname: this.fullname
  }
}

module.exports = mongoose.model('User', userSchema)
