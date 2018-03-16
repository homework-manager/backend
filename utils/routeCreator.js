function upperCaseFirst (string) {
  return string.substr(0, 1).toUpperCase()) + string.substr(1)
}

/*
 * This function takes something like:
 * {
 *   reqRequirements: {
 *     data: {
 *       required: true
 *       type: String
 *     }
 *   },
 *   data: {
 *     async responseData (body, previousData) {
 *       return 'some data'
 *     }
 *   }
 * }
 *
 * and returns a request handler for express.js
 */

function createRoute (settings) {
  if (!settings) {
    throw 'No settings defined!'
  }

  if (!settings.data) settings.data = {}
  if (!settings.reqRequirements) settings.reqRequirements = {}

  return async (req, res) => {
    const body = req.body

    const requirements = settings.reqRequirements

    for (const bodyPropName in requirements) {
      const requirement = requirements[bodyPropName]

      if (body.hasOwnProperty(bodyPropName)) {
        const bodyProp = body[bodyPropName]

        if (requirement.type &&
            !(bodyProp instanceof requirement.type))
        {
          typeName = upperCaseFirst(requirement.type.name)

          res.status(400).json({
            success: false,
            error: {
              `${bodyPropName}IsNot${typeName}`: true,
              message: `The property ${bodyPropName} must be type ${typeName}`
            }
          })
        }

        const regExp = requirement.regExp.regExp || requirement.regExp

        if (regExp &&
          !(regExp.test(bodyProp))
        {
          res.status(400).json({
            success: false,
            error: requirement.regExp.error || {
              `invalid${upperCaseFirst(bodyPropName)}`: true,
              message: `The property ${bodyPropName} doens't match the requirements.`
            }
          })
        }
      } else if (requirement.required) {
        res.status(400).json({
          success: false,
          error: {
            `${bodyPropName}DoesntExist`: true,
            message: `The property ${bodyPropName} must exist.`
          }
        })
      } else {
        // Ignore; it's not required and isn't in request
      }
    }

    let jsonResponse = {}

    for (const dataName in settings.data) {
      if (settings.data.hasOwnProperty(dataName)) {
        jsonResponse[dataName] = await settings.data[dataName](body, jsonResponse)
      }
    }

    res.status(200).json(jsonResponse)
  }
}

module.exports = {createRoute}
