/* eslint-disable import/no-dynamic-require */
const env = require(`./${process.env.NODE_ENV.toLowerCase()}.json`)
const database = require(`./config.json`)
const i18n = require('i18n')

i18n.configure({
  locales: ['en', 'es', 'de', 'fr'], // Combined set of supported locales
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  autoReload: true, // Existing feature from the old code
  updateFiles: false, // Existing feature from the old code
  objectNotation: true // New feature from the new code
})

module.exports = {
  ...env,
  database: {
    ...database[process.env.NODE_ENV]
  },
  i18n
}
