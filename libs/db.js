module.exports = {
  // Database related functions or objects will be added here
};
module.exports = {
  connect: function() {
    // Database connection logic here
  },
  // Other database related functions can be added here
};
const Sequelize = require('sequelize')
const connection = require('../config')
const logger = require('../utils/logger')

const ENV = process.env.NODE_ENV || 'development'

const dbService = (environment) => {
  const acceptable = ['development', 'staging', 'testing', 'production']
  if (!acceptable.includes(environment)) {
    throw new Error(`[Database] Wrong environment specified: ${environment}. Only eccept ${acceptable}.`)
  }
  const database = new Sequelize(
    connection.database.database,
    connection.database.username,
    connection.database.password, {
      host: connection.database.host,
      dialect: connection.database.dialect,
      define: connection.database.define,
      logging: connection.database.log ? msg => logger.silly(msg) : false
    }
  )
  const authenticate = async () => {
    await database.authenticate()
    logger.info(`[Database] Connected, host => ${connection.database.host}`)
  }
  const close = async () => {
    await database.close()
    logger.warn(`[Database] Disconnected, host => ${connection.database.host}`)
  }
  const sync = async () => {
    logger.debug('[Database] Synchronization start')
    await database.sync()
    logger.info('[Database] Synchronization completed')
  }

  return {
    authenticate,
    sync,
    close,
    database
  }
}

module.exports = dbService(ENV)
