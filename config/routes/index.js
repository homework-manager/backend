module.exports = {
  setupRoutes (app, passport) {
    const protectedRoute = () => passport.authenticate('jwt', {session: false})

    const login = require('./login.js')()
    const register = require('./register.js')()
    const profile = require('./profile.js')()
    const groups = require('./groups.js')()

    app.get('/login/session', protectedRoute(), login.checkSession)
    app.post('/login/session', login.login)

    app.post('/login/account', register.register)

    app.get('/login/profile', protectedRoute(), profile.getProfile)

    app.post('/group', protectedRoute(), groups.createGroup)
    app.post('/group/join', protectedRoute(), groups.joinGroup)

  }
}
