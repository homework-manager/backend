const mongo = require('./config/mongo.js')
const express = require('./config/express.js')

const log = require('./utils/logger.js').log

const LOG_PREFIX = '[main] '

Promise.all([
	mongo(),
	express()
])
	.then(() =>
		log(LOG_PREFIX + 'Started.'))
	.catch(err =>
		log(LOG_PREFIX + 'Something errored...terminating'))