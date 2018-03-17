const jwt = require('jsonwebtoken')
const createRoute = require('../../utils/routeCreator.js').createRoute
const User = require('./../schemas/User.js')
const passwords = require('./../../utils/passwords.js')

module.exports = () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev waffles'

  // TODO: document endpoints of this file

  return {

    /*
     * This path will return 200 if the
     * user is logged in
     * or 400 if not logged in
     */

    checkSession: createRoute({
      data: {
        success () {
          return true
        }
      }
    }),

    /**
     * login - route for logging in (duh)
     *
     * Only error that this route can throw is wrongUsernameOrPassword
     */

    login: createRoute({
      reqRequirements: {
        username: {
          required: true
        },
        password: {
          required: true
        }
      },
      async handler (body) {
        const user = await User.findOne({
          username: body.username
        })

        return {user}
      },
      data: {
        async success (body, vars, previousData) {
          return (
            vars.user &&
            await passwords.comparePasswords(body.password, vars.user.password)
          )
        },
        token (body, vars, previousData) {
          if (previousData.success) {
            return 'JWT ' + jwt.sign({
              id: vars.user._id
            }, JWT_SECRET, {
              expiresIn: 604800
            })
          } else {
            return undefined
          }
        },
        error (body, vars, previousData) {
          if (!previousData.success) {
            return {
              wrongUsernameOrPassword: true,
              message: 'Wrong username or password.'
            }
          } else {
            return undefined
          }
        },
        statusCode (body, vars, previousData) {
          if (previousData.error &&
              previousData.error.wrongUsernameOrPassword) {
            return 401
          } else {
            return 200
          }
        }
      }
    })

  }

}
