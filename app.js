/* global Promise */
global.Promise = require('bluebird')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const express = require('express')
const bodyParser = require('body-parser')
const status = require('http-status')
const config = require('./config')
const logger = require('./utils/logger')
const util = require('./utils/util')
const errors = require('./utils/errors')
const ApiError = require('./utils/api-error')
const response = require('./utils/response')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const setupRoutes = require('././libs/routes')

const exitProcess = () => setTimeout(() => process.exit(1), 100)

/** Global process events */
Promise.onPossiblyUnhandledRejection(async (error) => {
  await util.traceError(error)
  exitProcess()
})
process.on('uncaughtException', async (error) => {
  await util.traceError(error)
  exitProcess()
})
process.on('unhandledRejection', async (error) => {
  await util.traceError(error)
  exitProcess()
})

const start = async () => {
  try {
    logger.info('[Server] Initializing application')
    const app = express()
    app.server = http.createServer(app)
    // REGISTER
    app.use(cors())
    app.use(helmet({
      dnsPrefetchControl: false,
      frameguard: false,
      ieNoOpen: false
    }))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    // LOG REQUEST
    app.use((req, res, next) => {
      const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      const { originalUrl, method } = req
      logger.info(`[Server] ${clientIp} | ${method}: ${originalUrl}`)
      if (method.toUpperCase() !== 'GET') logger.debug(`[Server] Body: ${JSON.stringify(req.body)}`)
      next()
    })
    // STATICS
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
    // DATABASE
    const dbService = require('././libs/db')
    await dbService.authenticate()
    process.on('SIGINT', async () => {
      await dbService.close()
      exitProcess()
    })
    // ROUTES
    setupRoutes(app)
    // NOT FOUND
    app.use((req, res) => response(res).error(new ApiError('Api not found', status.NOT_FOUND)))
    // ERROR HANDLING
    app.use(errors.middleware)
    app.use((err, req, res, next) => {
      response(res).error(err)
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      if (req.files) {
        const uploaded = _.flattenDeep(req.files)
        uploaded.forEach((file) => fs.unlinkSync(file.path))
      }
      util.traceError(err)
    })
    app.server.listen(config.port, () => {
      logger.info(`[Server] Listening on port ${app.server.address().port}`)
    })
  } catch (e) {
    util.traceError(e)
    exitProcess()
  }
}

module.exports = {
  start
}
