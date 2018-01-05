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

  // Fix for cross-origin
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080")
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
  })

  // Support for JSON requests
  const bodyParser = require('body-parser')

  app.use(bodyParser.json())

  // Passport
  require('./passport.js')(app)

  const passport = require('passport')

  // Routes
  const login = require('./routes/login.js')()
  const register = require('./routes/register.js')()
  const profile = require('./routes/profile.js')()
  
  app.get('/login/session', passport.authenticate('jwt', {session: false}), login.checkSession)
  app.post('/login/session', login.login)

  app.post('/login/account', register.register)

  app.get('/login/profile', passport.authenticate('jwt', {session: false}), profile.getProfile)

  app.listen(PORT, () => {
    log(LOG_PREFIX + 'Listening in port ' + process.env.PORT)
    resolve()
  })
})
