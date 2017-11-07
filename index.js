const LOG_PREFIX = '[main] '

const log = require('./utils/logger.js').log

require('./config/express.js')()
  .then(() => {
    log(LOG_PREFIX + 'Started.')
  })
  .catch(err => {
    log(LOG_PREFIX + 'Something errored...terminating')
  })