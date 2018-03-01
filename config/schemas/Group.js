const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const ObjectId = mongoose.Schema.Types.ObjectId

const User = require('./User.js')

let groupMemberSchema = mongoose.Schema({
  id: ObjectId,
  roles: Array
}, {
  _id: false
})

groupMemberSchema.methods.getUser = async function () {
  const user = await User.findOne({_id: this.id})

  return user.getPublicData()
}

let groupSchema = mongoose.Schema({
  name: String,
  joinName: String,
  private: Boolean,
  members: [groupMemberSchema]
})

groupSchema.methods.addMember = function (memberId, roles) {
  const member = this.members.find(
    obj => memberId.equals(obj.id)
  )

  if (member) { // check if member already exists
    return member
  }

  const newMember = {
    id: memberId,
    roles
  }

  this.members.push(newMember)

  return newMember
}

groupSchema.methods.userIsMember = function (memberId) {
  const isMember = this.members.some(
    member => (
      member.id.equals(memberId)
    )
  )

  return isMember
}

groupSchema.methods.userIsAdmin = function (memberId) {
  const isAdmin = this.members.some(
    member => (
      member.id.equals(memberId) &&
      member.roles.some(
        role => role.admin
      )
    )
  )

  return isAdmin
}

module.exports = mongoose.model('Group', groupSchema)
