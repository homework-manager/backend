const Homework = require('./../schemas/Homework.js')
const Group = require('./../schemas/Group.js')

module.exports = () => {

  return {

    async getHomeworks (req, res) {
      const groups = await Group.find({
        members: {$elemMatch: {id: req.user._id}}
      })

      const homeworks = await Homework.find({
        groupId: groups.map(group => group._id)
      })

      console.log(homeworks)

      res.status(200).json({
        success: true,
        homeworks
      })
    },

    async createHomework (req, res) {
      const homeworkInfo = req.body.homework

      if (!homeworkInfo || !homeworkInfo.groupId) {

        return res.status(400).json({
          success: false,
          errors: {
            notValidRequest: true,
            message: 'Your code is broken.'
          }
        })

      } else if (!homeworkInfo.title) {

        return res.status(400).json({
          success: false,
          errors: {
            noTitle: true,
            message: 'You didn\'t specify any title for the homework.'
          }
        })

      } else if (homeworkInfo.title.length > 200) {

        return res.status(400).json({
          success: false,
          errors: {
            tooLongTitle: true,
            message: 'The title must be below 200 characters.'
          }
        })

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

      }

      const group = await Group.findOne({
        _id: homeworkInfo.groupId
      })

      if (!group) {

        return res.status(404).json({
          success: false,
          errors: {
            groupDoesntExist: true,
            message: 'There\'s no group matching that id.'
          }
        })

      }

      const hasPermission = group.members.some(
        member => (
          member.id.equals(req.user._id) &&
          member.roles.some(
            role => role.admin
          )
        )
      )

      if (!hasPermission) {

        return res.status(403).json({
          success: false,
          errors: {
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

    }

  }

}