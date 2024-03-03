
/* eslint-disable import/no-dynamic-require */
const env = require(`./${process.env.NODE_ENV.toLowerCase()}.json`)
const database = require(`./config.json`)
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'es', 'de'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  objectNotation: true,
  autoReload: true,
  updateFiles: false,
  extension: '.json'
});

module.exports = {
  ...env,
  database: {
    ...database[process.env.NODE_ENV]
  },
  i18n
}
