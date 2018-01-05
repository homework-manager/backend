const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const passwords = require('../../utils/passwords.js')

let groupSchema = mongoose.Schema({
  name: String,
  joinName: String,
  private: Boolean,
  members: Array
})

groupSchema.methods.addMember = function(memberId){
  const member = this.members.find(
    obj => obj.id === memberId
  )

  if (member) {
    return member
  }

  this.members.push({
    id: memberId
  })
}

module.exports = mongoose.model('Group', groupSchema)
