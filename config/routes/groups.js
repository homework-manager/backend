const Group = require('./../schemas/Group.js')

async function doGroupChecks (res, groupInfo) {
  if (!groupInfo.name) {

    res.status(400).json({
      success: false,
      error: {
        noName: true,
        message: 'You didn\'t specify any name.'
      }
    })
    return true

  } else if (!groupInfo.joinName) {

    res.status(400).json({
      success: false,
      error: {
        noJoinName: true,
        message: 'You didn\'t specify any join name.'
      }
    })
    return true

  } else if (groupInfo.name.length > 100) {

    res.status(400).json({
      success: false,
      error: {
        tooLongName: true,
        message: 'The name must be below 100 characters.'
      }
    })
    return true

  } else if (groupInfo.joinName.length > 50) {

    res.status(400).json({
      success: false,
      error: {
        tooLongJoinName: true,
        message: 'The join name must be below 50 characters.'
      }
    })
    return true

  } else if (!(/^[a-z0-9]+$/i.test(groupInfo.joinName))) {

    res.status(400).json({
      success: false,
      error: {
        invalidJoinName: true,
        message: 'The join name is invalid. It must be alphanumerical and not contain spaces.'
      }
    })
    return true

  }

  let groupWithJoinName

  if (groupInfo._id) {
    groupWithJoinName = await Group.findOne({
      _id: { // $ne = not equal
        $ne: groupInfo._id
      },
      joinName: groupInfo.joinName
    })
  } else {
    groupWithJoinName = await Group.findOne({
      joinName: groupInfo.joinName
    })
  }

  if (groupWithJoinName) {
    res.status(409).json({
      success: false,
      error: {
        joinNameAlreadyUsed: true,
        message: 'There\'s already a group with that join name.'
      }
    })
    return true
  }

  return false
}

// ========================================

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
      }

      if (await doGroupChecks(res, groupInfo)) {
        return
      }

      const newGroup = new Group()

      newGroup.name = groupInfo.name
      newGroup.joinName = groupInfo.joinName
      newGroup.private = groupInfo.private || false
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
      } else if (groupToJoin.private) {
        return res.status(400).json({
          success: false,
          error: {
            private: true,
            message: 'This group is private. You need to have permission to enter.'
          }
        })
      }

      groupToJoin.addMember(req.user._id)

      await groupToJoin.save()

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
    },

    // ========================================

    async editGroup (req, res) {
      const groupInfo = req.body.groupInfo

      if (!groupInfo) {
        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })
      }

      const group = await Group.findOne({_id: groupInfo._id})

      const hasPermission = group.userIsAdmin(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to edit the settings of this group.'
          }
        })

      }

      if (await doGroupChecks(res, groupInfo)) {
        return
      }

      group.name = groupInfo.name || group.name
      group.joinName = groupInfo.joinName || group.joinName
      group.private = groupInfo.private !== undefined ? groupInfo.private : group.private

      await group.save()

      res.status(200).json({
        success: true,
        group
      })
    },

    // ========================================

    async addAdminToUser (req, res) {
      const [memberId, groupId] = [req.body.memberId, req.body.groupId]

      const group = await Group.findOne({_id: groupId})

      const hasPermission = group.userIsAdmin(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to give admin to pepole.'
          }
        })

      }

      const member = group.members.find(member => member.id.equals(memberId))

      member.addAdmin()

      await group.save()

      res.status(200).json({
        success: true,
        group
      })
    },

    // ========================================

    async removeAdminFromUser (req, res) {
      const [memberId, groupId] = [req.body.memberId, req.body.groupId]

      if (req.user._id.equals(memberId)) {
        return res.status(409).json({
          success: false,
          error: {
            removeAdminFromSelf: true,
            message: 'You can\'t remove admin from yourself, lol!'
          }
        })
      }

      const group = await Group.findOne({_id: groupId})

      const hasPermission = group.userIsAdmin(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to remove admin from pepole.'
          }
        })

      }

      const member = group.members.find(member => member.id.equals(memberId))

      member.removeAdmin()

      await group.save()

      res.status(200).json({
        success: true,
        group
      })
    }
  }

}
