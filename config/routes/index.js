module.exports = {
  setupRoutes (app, passport) {
    const handleUnauthorized = (err, req, res, next) =>
      res.status(401).json({
        success: false,
        error: {
          notLoggedIn: true,
          message: 'You\'re not logged in.'
        }
      })

    const protectedRoute = handler =>
      passport.authenticate(
        'jwt', {
          session: false,
          failWithError: true
        })

    const login = require('./login.js')()
    const register = require('./register.js')()
    const profile = require('./profile.js')()
    const groups = require('./groups.js')()
    const homeworks = require('./homeworks.js')()

    app.get(
      '/login/session',
      protectedRoute(login.checkSession),
      login.checkSession,
      handleUnauthorized)
    app.post(
      '/login/session',
      login.login)

    app.post(
      '/login/account',
      register.register)

    app.get(
      '/login/profile',
      protectedRoute(),
      profile.getProfile,
      handleUnauthorized)

    app.post(
      '/group',
      protectedRoute(),
      groups.createGroup,
      handleUnauthorized)
    app.post(
      '/group/join',
      protectedRoute(),
      groups.joinGroup,
      handleUnauthorized)
    app.get(
      '/groups',
      protectedRoute(),
      groups.getGroups,
      handleUnauthorized)

    app.put(
      '/homework',
      protectedRoute(),
      homeworks.createHomework,
      handleUnauthorized)
    app.get(
      '/homeworks',
      protectedRoute(),
      homeworks.getHomeworks,
      handleUnauthorized)

  }
}
