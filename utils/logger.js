const { createLogger, transports, format } = require('winston')
const moment = require('moment')
const config = require('../config')

class Logger {
  constructor (config) {
    const transportOptions = []

    if (config.consoleEnable) {
      const consoleTransport = new transports.Console({
        level: config.consoleLevel,
        format: format.combine(
          format.printf((info) => {
            info.level = `[${moment.utc().format('YYYY/MM/DD hh:mm:ss.SSS')}] ${info.level.padEnd(5, ' ')}`
            return info
          }),
          format.colorize(),
          format.simple()
        )
      })
      transportOptions.push(consoleTransport)
    }

    if (config.fileEnable) {
      const fileTransport = new transports.File({
        level: config.fileLevel,
        filename: `${config.filePath}/${config.fileName}`,
        maxsize: config.fileMaxSize,
        format: format.combine(
          format.timestamp(),
          format.json()
        )
      })
      transportOptions.push(fileTransport)
    }
    this.logger = createLogger({
      transports: transportOptions
    })
    this.loggerLevels = ['error', 'warn', 'info', 'debug', 'verbose', 'silly']
    this.loggerLevels.forEach((level) => {
      this[level] = (message, meta) => this.log(message, meta, level)
    })
  }

  log (message, meta, level) {
    this.logger[level](message, meta)
  }
}

module.exports = new Logger(config.logger)
