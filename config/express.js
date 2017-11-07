module.exports = () => new Promise((resolve, reject) => {
  const LOG_PREFIX = '[express] '

  const log = require('./../utils/logger.js').log

  if(!process.env.PORT){
    log(LOG_PREFIX + 'No PORT env variable...terminating')
    reject()
    return
  }

  const express = require('express')
  const app = express()

  // Fix for cross-origin
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    next()
  })

  app.get('/data', (req, res) => {
    log(LOG_PREFIX + "Request at /data")
    res.send({
      data: 'useful data'
    })
  })

  app.listen(process.env.PORT, () => {
    log(LOG_PREFIX + 'Listening in port ' + process.env.PORT)    
    resolve()
  })
})