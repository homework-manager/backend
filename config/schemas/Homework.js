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

  if (userAlreadyDone) {
    return userAlreadyDone
  } else {
    this.doneBy.push(userId)
  }
}

module.exports = mongoose.model('Homework', homeworkSchema)
