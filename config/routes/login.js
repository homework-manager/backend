module.exports = {}

module.exports.isLoggedIn = (req, res) => {
  if(req.isAuthenticated())
    res.status(200).json({
      success: true
    })
  else
    res.status(401).json({
      success: false
    })
}

module.exports.login = (req, res) => {
  res.status(200).json({
    success: true
  })
}

module.exports.logout = (req, res) => {
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