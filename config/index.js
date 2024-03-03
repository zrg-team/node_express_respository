
/* eslint-disable import/no-dynamic-require */
const env = require(`./${process.env.NODE_ENV.toLowerCase()}.json`)
const database = require(`./config.json`)
const path = require('path')
const i18n = require('i18n')

i18n.configure({
  locales: ['en', 'es', 'de', 'fr'], // Combined set of supported locales
  directory: __dirname + '/locales',
  defaultLocale: 'en', // Preserved from the existing code
  autoReload: true, // Automatically reload translation files when they are changed
  updateFiles: false, // Preserved from the existing code
  syncFiles: true, // Ensure new keys are added to all translation files
  objectNotation: true // Preserved from the existing code
})

module.exports = {
  ...env,
  database: {
    ...database[process.env.NODE_ENV]
  },
  i18n
}
