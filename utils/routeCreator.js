function upperCaseFirst (string) {
  return string.substr(0, 1).toUpperCase()) + string.substr(1)
}

/**
 * createRoute - generate route handlers for express.js
 *
 * This function takes something like:
 *
 * @param {Object} settings
 * settings object
   * @param {Object|undefined} settings.reqRequirements
   * request body requirements
     * @param {Object|undefined} settings.reqRequirements.data
     * requirements
       * @param {Boolean|false} settings.reqRequirements.data.required
       * is that data required? defaults to false
       * @param {type|undefined} settings.reqRequirements.data.type
       * what type is that data? not specified = won't check
   * @param {Object|undefined} settings.data
   * functions that generate the response object (can return promises)
     * @param {AsyncFunction|function|undefined} settings.data.exampleData
     * this function takes (body, previousData)
     * and must return something to use as that data
 *
 * and returns a handler for express.js
 * @return {AsyncFunction} handlerForRoute
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
