const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const ObjectId = mongoose.Schema.Types.ObjectId

let homeworkSchema = mongoose.Schema({
  title: String,
  description: String,
  groupId: ObjectId,
  createdBy: ObjectId,
  createdAt: {type: Date, default: Date.now},
  doneBy: {type: [ObjectId], default: []}
})

homeworkSchema.methods.markUserAsDone = function (userId) {
  const userAlreadyDone = this.doneBy.find(id => id.equals(userId))

  if (!userAlreadyDone) {
    this.doneBy.push(userId)
  }
}

homeworkSchema.methods.markUserAsNotDone = function (userId) {
  const userDone = this.doneBy.findIndex(id => id.equals(userId))

  // index can be 0, have to check for undefined only
  if (userDone !== undefined) {
    this.doneBy.splice(userDone, 1)
  }
}

module.exports = mongoose.model('Homework', homeworkSchema)
