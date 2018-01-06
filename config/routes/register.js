module.exports = () => {

  return {

    register: async (req, res) => {
      const User = require('./../schemas/User.js')

      // TODO: Username & password verification
      // is there a username on the first place? or email, or password?
      // (does it have enough chars? what chars on username?)
      // (data requirements are in the info repo)

      const existingUserWithUsername = await User.findOne({
        username: req.body.username
      })

      if (existingUserWithUsername) {
        return res.status(409).json({
          success: false,
          errors: {
            existingUsername: 'Username is already being used.'
          }
        })
      }

      const existingUserWithEmail = await User.findOne({
        email: req.body.email
      })

      if (existingUserWithEmail) {
        return res.status(409).json({
          success: false,
          errors: {
            existingEmail: 'Email is already being used.'
          }
        })
      }

      let newUser = new User({
        username: req.body.username,
        email: req.body.email
      })

      await newUser.changePassword(req.body.password)

      await newUser.save()

      res.status(200).json({
        success: true
      })
    }

  }

}
