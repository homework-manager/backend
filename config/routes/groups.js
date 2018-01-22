module.exports = () => {

  return {

    async createGroup (req, res) {
      const Group = require('./../schemas/Group.js')

      const groupInfo = req.body.group

      if (groupInfo.name == undefined) {
        return res.status(400).json({
          success: false,
          errors: {
            noName: 'You didn\'t choose any name.'
          }
        })
      }

      // TODO: Check that joinname is alphanumerical
      // and doesn't contain spaces

      const groupWithJoinName = await Group.findOne({joinName: groupInfo.joinName})

      if (groupWithJoinName) {
        return res.status(409).json({
          success: false,
          errors: {
            joinNameAlreadyUsed: 'There\'s already a group with that join name.'
          }
        })
      }

      const newGroup = new Group()

      newGroup.name = groupInfo.name
      newGroup.joinName = groupInfo.joinName
      newGroup.private = groupInfo.private != undefined ? groupInfo.private : true
      newGroup.members = [
        {
          id: req.user._id,
          roles: {
            admin: true
          }
        }
      ]

      await newGroup.save()

      res.status(200).json({
        success: true,
        group: newGroup
      })
    },

    async joinGroup (req, res) {
      const Group = require('./../schemas/Group.js')

      const groupToJoin = await Group.findOne({
        joinName: req.body.joinName
      })

      if (!groupToJoin) {
        return res.status(404).json({
          success: false,
          errors: {
            groupDoesntExist: 'This group doesn\'t exist.'
          }
        })
      }

      if (groupToJoin.private) {
        return res.status(400).json({
          success: false,
          errors: {
            private: 'This group is private. You need to have permission to enter.'
          }
        })
      }

      await groupToJoin.addMember(req.user._id)

      res.status(200).json({
        success: true,
        group: groupToJoin
      })
    }

  }

}
