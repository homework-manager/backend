module.exports = (app) => new Promise(async (resolve, reject) => {
  const LOG_PREFIX = '[passport] '
  const JWT_SECRET = process.env.JWT_SECRET || 'dev waffles'
  const ENV = process.env.NODE_ENV || 'dev'

  const log = require('./../utils/logger.js').log

  if(!process.env.JWT_SECRET && ENV == 'dev'){
    log(LOG_PREFIX + 'Warning: No JWT_SECRET env variable...')
    log(LOG_PREFIX + 'Going to continue with \'' + JWT_SECRET + '\', because on dev env...')
  } else if(!process.env.JWT_SECRET){
    log(LOG_PREFIX + 'No JWT_SECRET env variable and on prod env...terminating')
    reject()
    return
  }

  const passport = require('passport')

  const passportJWT = require('passport-jwt')
  const ExtractJwt = passportJWT.ExtractJwt
  const JwtStrategy = passportJWT.Strategy

  app.use(passport.initialize())
  app.use(passport.session())

  const User = require('./schemas/User.js')

  try {
    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: JWT_SECRET,
    }, async (jwt_payload, done) => {
      const user = await User.findOne({_id: jwt_payload.id})

      if(user){
        return done(null, user)
      } else {
        return done(null, false, {success: false})
      }
    }))
  } catch(err){
    log(LOG_PREFIX + 'Error: ' + err)
    throw err
  }

  resolve()
})
