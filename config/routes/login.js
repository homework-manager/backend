module.exports = () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev waffles'

  return {

    checkSession: (req, res) =>
      res.status(200).json({
        success: true
      }),

    login: async (req, res) => {
      const jwt = require('jsonwebtoken')
      const User = require('./../schemas/User.js')
      const passwords = require('./../../utils/passwords.js')

      const username = req.body.username
      const password = req.body.password
      
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

    logout: (req, res) => {
      if(req.user){
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
