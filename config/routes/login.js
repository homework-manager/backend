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

    /*
     * This path can only return 2 things
     * if it went succesfully:
     * 200 or 401
     * 200 means that the session has been created
     * and a token is attached to it
     * 401 means that the username or password
     * is wrong.
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
          return previousData.error.wrongUsernameOrPassword ? 401 : 200
        }
      }
    })

  }

}
