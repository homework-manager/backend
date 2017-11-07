module.exports = {}

module.exports.hashPassword = password => {
  const bcrypt = require('bcryptjs')
  
  return bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
}

module.exports.comparePasswords = (pw1, pw2) => {
  const bcrypt = require('bcryptjs')

  return bcrypt.compare(pw1, pw2)
}