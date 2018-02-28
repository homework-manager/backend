module.exports = () => {

  // TODO: document endpoints of this file

  return {

    register: async (req, res) => {
      const User = require('./../schemas/User.js')

      const accountInfo = req.body.accountInfo

      if (!accountInfo) {
        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })
      } else if (!accountInfo.username) {
        return res.status(400).json({
          success: false,
          error: {
            noUsername: true,
            message: 'You didn\'t specify any username.'
          }
        })
      } else if (!accountInfo.email) {
        return res.status(400).json({
          success: false,
          error: {
            noEmail: true,
            message: 'You didn\'t specify any email.'
          }
        })
      } else if (!accountInfo.password) {
        return res.status(400).json({
          success: false,
          error: {
            noPassword: true,
            message: 'You didn\'t specify any password.'
          }
        })
      } else if (!(/^[a-zA-Z0-9_]{1,16}$/.test(accountInfo.username))) {
        return res.status(400).json({
          success: false,
          error: {
            invalidUsername: true,
            message: 'The username is invalid. It can only contain letters, numbers or underscores and must be 16 characters or less.'
          }
        })
      } else if (!(/^[A-Z0-9._%+-]{1,32}@[A-Z0-9._]{4,32}$/i.test(accountInfo.email))) {
        return res.status(400).json({
          success: false,
          error: {
            invalidEmail: true,
            message: 'The email is invalid.'
          }
        })
      } else if (!(/^.{6}$/.test(accountInfo.password))) {
        return res.status(400).json({
          success: false,
          error: {
            invalidPassword: true,
            message: 'The password is invalid. It must be at least 6 characters.'
          }
        })
      }

      const existingUserWithUsername = await User.findOne({
        username: req.body.username
      })

      if (existingUserWithUsername) {
        return res.status(409).json({
          success: false,
          error: {
            existingUsername: true,
            message: 'Username is already being used.'
          }
        })
      }

      const existingUserWithEmail = await User.findOne({
        email: req.body.email
      })

      if (existingUserWithEmail) {
        return res.status(409).json({
          success: false,
          error: {
            existingEmail: true,
            message: 'Email is already being used.'
          }
        })
      }

      let newUser = new User({
        username: accountInfo.username,
        email: accountInfo.email
      })

      await newUser.changePassword(accountInfo.password)

      await newUser.save()

      res.status(200).json({
        success: true
      })
    }

  }

}
