module.exports = () => {
  return {

    getProfile: (req, res) => {
      res.status(200).json({
        success: true,
        profile: {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email
        }
      })
    }

  }
}
