module.exports = () => {
  return {

    getProfile: (req, res) => {
      res.status(200).json({
        success: true,
        profile: {
          username: req.user.username
        }
      })
    }
    
  }
}
