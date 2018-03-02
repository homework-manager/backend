const Homework = require('./../schemas/Homework.js')
const Group = require('./../schemas/Group.js')

async function doHomeworkChecks (res, homeworkInfo) {
  if (!homeworkInfo.title) {

    res.status(400).json({
      success: false,
      error: {
        noTitle: true,
        message: 'You didn\'t specify any title for the homework.'
      }
    })
    return true

  } else if (homeworkInfo.title.length > 200) {

    return res.status(400).json({
      success: false,
      error: {
        tooLongTitle: true,
        message: 'The title must be below 200 characters.'
      }
    })
    return true

  } else if (
    homeworkInfo.description &&
    homeworkInfo.description.length > 5000
  ) {

    return res.status(400).json({
      success: false,
      error: {
        tooLongDescription: true,
        message: 'The description must be below 5000 characters.'
      }
    })
    return true

  }

  return false
}

// ========================================

module.exports = () => {

  return {

    async getHomeworks (req, res) {
      const groups = await Group.find({
        members: {$elemMatch: {id: req.user._id}}
      })

      const homeworks = await Homework.find({
        groupId: groups.map(group => group._id)
      })

      res.status(200).json({
        success: true,
        homeworks
      })
    },

    // ========================================

    async createHomework (req, res) {
      const homeworkInfo = req.body.homework

      if (!homeworkInfo || !homeworkInfo.groupId) {

        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })

      } else if (await doHomeworkChecks(res, homeworkInfo)) {
        return
      }

      const group = await Group.findOne({
        _id: homeworkInfo.groupId
      })

      if (!group) {

        return res.status(404).json({
          success: false,
          error: {
            groupDoesntExist: true,
            message: 'There\'s no group matching that id.'
          }
        })

      }

      const hasPermission = group.userIsAdmin(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to add homeworks on this group.'
          }
        })

      }

      const newHomework = new Homework()

      newHomework.title = homeworkInfo.title
      if (homeworkInfo.description) {
        newHomework.description = homeworkInfo.description
      }
      newHomework.groupId = homeworkInfo.groupId
      newHomework.createdBy = req.user._id

      await newHomework.save()

      res.status(200).json({
        success: true,
        homework: newHomework
      })

    },

    // ========================================

    async markAsDone (req, res) {
      const homeworkId = req.body.homeworkId

      if (!homeworkId) {

        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })

      }

      const homework = await Homework.findOne({
        _id: homeworkId
      })

      if (!homework) {

        return res.status(404).json({
          success: false,
          error: {
            homeworkDoesntExist: true,
            message: 'The requested homework doesn\'t exist.'
          }
        })

      }

      const group = await Group.findOne({
        _id: homework.groupId
      })

      const hasPermission = group.userIsMember(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to interact with this homework.'
          }
        })

      }

      homework.markUserAsDone(req.user._id)

      await homework.save()

      res.status(200).json({
        success: true,
        homework
      })
    },

    // ========================================

    async markAsNotDone (req, res) {
      const homeworkId = req.body.homeworkId

      if (!homeworkId) {

        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })

      }

      const homework = await Homework.findOne({
        _id: homeworkId
      })

      if (!homework) {

        return res.status(404).json({
          success: false,
          error: {
            homeworkDoesntExist: true,
            message: 'The requested homework doesn\'t exist.'
          }
        })

      }

      const group = await Group.findOne({
        _id: homework.groupId
      })

      const hasPermission = group.userIsMember(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to interact with this homework.'
          }
        })

      }

      homework.markUserAsNotDone(req.user._id)

      await homework.save()

      res.status(200).json({
        success: true,
        homework
      })
    },

    // ========================================

    async deleteHomework (req, res) {
      const homeworkId = req.body.homeworkId

      if (!homeworkId) {

        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })

      }

      const homework = await Homework.findOne({
        _id: homeworkId
      })

      if (!homework) {

        return res.status(404).json({
          success: false,
          error: {
            homeworkDoesntExist: true,
            message: 'The requested homework doesn\'t exist.'
          }
        })

      }

      const group = await Group.findOne({
        _id: homework.groupId
      })

      const hasPermission = group.userIsAdmin(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to delete this homework.'
          }
        })

      }

      await Homework.remove({_id: homeworkId})

      res.status(200).json({
        success: true
      })
    },

    // ========================================

    async editHomework (req, res) {
      const homeworkInfo = req.body.homeworkInfo

      if (!homeworkInfo) {

        return res.status(400).json({
          success: false,
          error: {
            invalidRequest: true,
            message: 'Your code is broken.'
          }
        })

      } else if (await doHomeworkChecks(res, homeworkInfo)) {
        return
      }

      const homework = await Homework.findOne({_id: homeworkInfo._id})

      if (!homework) {

        return res.status(404).json({
          success: false,
          error: {
            homeworkDoesntExist: true,
            message: 'The requested homework doesn\'t exist.'
          }
        })

      }

      const group = await Group.findOne({
        _id: homework.groupId
      })

      const hasPermission = group.userIsAdmin(req.user._id)

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          error: {
            forbidden: true,
            message: 'You don\'t have permission to edit homeworks on this group.'
          }
        })

      }

      homework.title = homeworkInfo.title || homeworkInfo.title
      homework.description = homeworkInfo.description || homeworkInfo.description || undefined

      res.status(200).json({
        success: true,
        homework
      })
    }

  }

}
