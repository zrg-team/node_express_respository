/* eslint-disable import/no-dynamic-require */
const env = require(`./${process.env.NODE_ENV.toLowerCase()}.json`)
const database = require(`./config.json`)
module.exports = {
  ...env,
  database: {
    ...database[process.env.NODE_ENV]
  },
  pagination: {
    defaultLimit: 10
  }
}
