module.exports = (app) => new Promise(async (resolve, reject) => {
  const LOG_PREFIX = '[passport] '
  const SESSION_SECRET = process.env.SESSION_SECRET || 'dev waffles'
  const ENV = process.env.NODE_ENV || 'dev'

  const log = require('./../utils/logger.js').log

  if(!process.env.SESSION_SECRET && ENV == 'dev'){
    log(LOG_PREFIX + 'Warning: No SESSION_SECRET env variable...')
    log(LOG_PREFIX + 'Going to continue with \'' + SESSION_SECRET + '\', because on dev env...')
  } else if(!process.env.SESSION_SECRET){
    log(LOG_PREFIX + 'No SESSION_SECRET env variable and on prod...terminating')
    reject()
    return
  }

  const session = require('express-session')

  const passport = require('passport')
  const LocalStrategy = require('passport-local').Strategy

  app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  const User = require('./schemas/User.js')
  const passwords = require('./../utils/passwords.js')

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser(async (user, done) => {
    const userFromDB = await User.findOne({
      _id: user._id
    })

    done(null, userFromDB)
  })

  try {
    passport.use(new LocalStrategy({
      passReqToCallback: true
    },
      async (req, username, password, done) => {
        const user = await User.findOne({username: username})

        // If user doesn't exist
        if(!user)
          return done(null, false, 'Username or password is wrong')

        const isValid = await passwords.comparePasswords(password, user.password)

        // If password is not valid
        if(!isValid)
          return done(null, false, 'Username or password is wrong')

        return done(null, user)
      }
    ))
  } catch(err){
    log(LOG_PREFIX + 'Error: ' + err)
    throw err
  }

  resolve()
})