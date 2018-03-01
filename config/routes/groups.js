const Group = require('./../schemas/Group.js')

module.exports = () => {

  return {

    async createGroup (req, res) {
      const groupInfo = req.body.group

      if (!groupInfo) {
        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })
      } else if (!groupInfo.name) {
        return res.status(400).json({
          success: false,
          error: {
            noName: true,
            message: 'You didn\'t specify any name.'
          }
        })
      } else if (!groupInfo.joinName) {
        return res.status(400).json({
          success: false,
          error: {
            noJoinName: true,
            message: 'You didn\'t specify any join name.'
          }
        })
      } else if (groupInfo.name.length > 100) {
        return res.status(400).json({
          success: false,
          error: {
            tooLongName: true,
            message: 'The name must be below 100 characters.'
          }
        })
      } else if (groupInfo.joinName.length > 50) {
        return res.status(400).json({
          success: false,
          error: {
            tooLongJoinName: true,
            message: 'The join name must be below 50 characters.'
          }
        })
      } else if (!(/^[a-z0-9]+$/i.test(groupInfo.joinName))) {
        return res.status(400).json({
          success: false,
          error: {
            invalidJoinName: true,
            message: 'The join name is invalid. It must be alphanumerical and not contain spaces.'
          }
        })
      }

      const groupWithJoinName = await Group.findOne({joinName: groupInfo.joinName})

      if (groupWithJoinName) {
        return res.status(409).json({
          success: false,
          error: {
            joinNameAlreadyUsed: true,
            message: 'There\'s already a group with that join name.'
          }
        })
      }

      const newGroup = new Group()

      newGroup.name = groupInfo.name
      newGroup.joinName = groupInfo.joinName
      newGroup.private = groupInfo.private != undefined ? groupInfo.private : true
      newGroup.addMember(req.user._id, {admin: true})

      await newGroup.save()

      res.status(200).json({
        success: true,
        group: newGroup
      })
    },

    // ========================================

    async joinGroup (req, res) {
      const joinName = req.body.joinName

      if (!joinName) {
        return res.status(400).json({
          success: false,
          error: {
            noJoinName: true,
            message: 'You didn\'t specify any join name.'
          }
        })
      }

      const groupToJoin = await Group.findOne({
        joinName
      })

      if (!groupToJoin) {
        return res.status(404).json({
          success: false,
          error: {
            groupDoesntExist: true,
            message: 'This group doesn\'t exist.'
          }
        })
      }

      if (groupToJoin.private) {
        return res.status(400).json({
          success: false,
          error: {
            private: true,
            message: 'This group is private. You need to have permission to enter.'
          }
        })
      }

      await groupToJoin.addMember(req.user._id)

      res.status(200).json({
        success: true,
        group: groupToJoin
      })
    },

    // ========================================

    async getGroups (req, res) {
      const groups = await Group.find({
        members: {$elemMatch: {id: req.user._id}}
      })

      res.status(200).json({
        success: true,
        groups
      })
    }

  }

}
