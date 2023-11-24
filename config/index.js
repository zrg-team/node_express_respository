/* eslint-disable import/no-dynamic-require */
const env = require(`./${process.env.NODE_ENV.toLowerCase()}.json`)
const database = require(`./config.json`)
const emailService = require(`./emailService.json`)
module.exports = {
  ...env,
  database: {
    ...database[process.env.NODE_ENV]
  },
  emailService: {
    ...emailService[process.env.NODE_ENV]
  }
}
