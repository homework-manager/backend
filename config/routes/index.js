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

    const protectedRoute = () =>
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

    const routes = [
      {
        path: '/login/session',
        method: 'get',
        handler: login.checkSession,
        protected: true
      },
      {
        path: '/login/session',
        method: 'post',
        handler: login.login
      },

      {
        path: '/login/account',
        method: 'post',
        handler: register.register
      },

      {
        path: '/login/profile',
        method: 'get',
        handler: profile.getProfile,
        protected: true
      },

      {
        path: '/group',
        method: 'post',
        handler: groups.createGroup,
        protected: true
      },
      {
        path: '/group/join',
        method: 'post',
        handler: groups.joinGroup,
        protected: true
      },
      {
        path: '/groups',
        method: 'get',
        handler: groups.getGroups,
        protected: true
      },

      {
        path: '/homework',
        method: 'put',
        handler: homeworks.createHomework,
        protected: true
      },
      {
        path: '/homework',
        method: 'delete',
        handler: homeworks.deleteHomework,
        protected: true
      },
      {
        path: '/homeworks',
        method: 'get',
        handler: homeworks.getHomeworks,
        protected: true
      },
      {
        path: '/homework/done',
        method: 'patch',
        handler: homeworks.markAsDone,
        protected: true
      },
      {
        path: '/homework/notDone',
        method: 'patch',
        handler: homeworks.markAsNotDone,
        protected: true
      }
    ]

    for (route of routes) {
      if (route.protected) {
        app[route.method](
          route.path,
          protectedRoute(),
          route.handler,
          handleUnauthorized
        )
      } else {
        app[route.method](
          route.path,
          route.handler
        )
      }
    }

  }
}
