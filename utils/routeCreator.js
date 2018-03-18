function upperCaseFirst (string) {
  return string.substr(0, 1).toUpperCase()) + string.substr(1)
}

/**
 * createRoute - generate route handlers for express.js
 *
 * Look at doc/routeCreatorExample.js for a *good* example
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
   * @param {AsyncFunction|function|undefined} settings.handler
   * a handler that gets executed before the data functions, and returns some
   * variables that WON'T get sent in the request
   * @param {Object|undefined} settings.data
   * functions that generate the response object (can return promises)
     * @param {AsyncFunction|function|undefined} settings.data.exampleData
     * this function takes (body, previousData)
     * and must return something to use as that data
     * @param {AsyncFunction|function|undefined} settings.data.statusCode
     * this is a special data attribute, what this function returns will be
     * the statusCode response (defaults to 200)
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

    // requirements
    for (const bodyPropName in requirements) {
      const requirement = requirements[bodyPropName]

      if (body.hasOwnProperty(bodyPropName)) {
        const bodyProp = body[bodyPropName]

        // data type
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

        // regexp
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
      // if doesn't exist in request and is required
      // throw error
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

    let handlerResponse = await settings.handler(body)

    let jsonResponse = {}

    for (const dataName in settings.data) {
      if (settings.data.hasOwnProperty(dataName)) {
        jsonResponse[dataName] =
          await settings.data[dataName](body, handlerResponse, jsonResponse)
      }
    }

    res.status(jsonResponse.statusCode || 200).json(jsonResponse)
  }
}

module.exports = {createRoute}
