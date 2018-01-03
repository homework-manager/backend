module.exports = () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev waffles'

  return {

    /*
     * This path will return 200 if the
     * user is logged in
     * or 400 if not logged in
     */

    checkSession: (req, res) =>
      res.status(200).json({
        success: true
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

    login: async (req, res) => {
      const jwt = require('jsonwebtoken')
      const User = require('./../schemas/User.js')
      const passwords = require('./../../utils/passwords.js')

      const username = req.body.username
      const password = req.body.password
      
      // TODO: Check if there is even a username or password
      // It errors if it doesn't

      const user = await User.findOne({
        username: username
      })

      if(!user)
        return res.status(401).json({
          success: false,
          errors: {
            wrongUsernameOrPassword: 'Wrong username or password.'
          }
        })

      const validPassword = await passwords.comparePasswords(password, user.password)

      if(validPassword){
        const token = jwt.sign({
          id: user._id
        }, JWT_SECRET, {
          expiresIn: 604800
        })

        res.status(200).json({
          success: true,
          token: 'JWT ' + token
        })
      } else {
        res.status(401).json({
          success: false,
          errors: {
            wrongUsernameOrPassword: 'Wrong username or password.'
          }
        })
      }
    },

    /*
     * This path will return 200 if the
     * user succesfully logged out
     * or 400 if not logged in.
     */

    logout: (req, res) => {
      if(req.logout){
        req.logout()
        res.status(200).json({
          success: true
        })
        return
      }

      res.status(400).json({
        success: false,
        error: {
          notLoggedIn: 'You are not logged in, so don\'t even try logging out!'
        }
      })
    }

  }

}
