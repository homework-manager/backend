module.exports = () => new Promise(async (resolve, reject) => {
  const LOG_PREFIX = '[express] '
  const PORT = process.env.PORT

  const log = require('./../utils/logger.js').log

  if(!PORT){
    log(LOG_PREFIX + 'No PORT env variable...terminating')
    reject()
    return
  }

  const express = require('express')
  const app = express()

  const bodyParser = require('body-parser')

  // Fix for cross-origin
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    next()
  })

  // Support for JSON requests
  app.use(bodyParser.json())

  // Passport
  await require('./passport.js')(app)

  const passport = require('passport')

  // Routes
  app.get('/data', require('./routes/dummy.js'))

  const login = require('./routes/login.js')

  app.get('/login/session', login.isLoggedIn)
  app.post('/login/session', passport.authenticate('local'), login.login)
  app.delete('/login/session', login.logout)

  app.post('/login/account', require('./routes/register.js').register)

  app.listen(PORT, () => {
    log(LOG_PREFIX + 'Listening in port ' + process.env.PORT)    
    resolve()
  })
})