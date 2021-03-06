module.exports = () => new Promise((resolve, reject) => {
  const LOG_PREFIX = '[mongo] '
  const DB_HOST = process.env.DB_HOST

  const log = require('./../utils/logger.js').log

  if(!DB_HOST){
    log(LOG_PREFIX + 'No DB_HOST env variable...terminating')
    reject()
    return
  }

  const mongoose = require('mongoose')

  mongoose.connect(DB_HOST, {})
  mongoose.Promise = global.Promise

  const db = mongoose.connection

  db.on('error', err => {
    log(LOG_PREFIX + 'Error: ' + err)
    reject(err)
    return
  })

  db.once('open', () => {
    log(LOG_PREFIX + 'Connected to DB @ ' + DB_HOST)
    resolve(mongoose)
  })
})
