const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const ObjectId = mongoose.Schema.Types.ObjectId

let homeworkSchema = mongoose.Schema({
  title: String,
  description: String,
  groupId: ObjectId,
  createdBy: ObjectId,
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Homework', homeworkSchema)
