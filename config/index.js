
/* eslint-disable import/no-dynamic-require */
const env = require(`./${process.env.NODE_ENV.toLowerCase()}.json`)
const database = require(`./config.json`)
const i18n = require('i18n')

i18n.configure({
  locales: ['en', 'es'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  autoReload: true,
  syncFiles: true,
  objectNotation: true
})

const DEFAULT_PAGINATION_LIMIT = 10;
const MAX_PAGINATION_LIMIT = 100;

module.exports = {
  ...env,
  database: {
    ...database[process.env.NODE_ENV]
  },
  i18n,
  articleUpdate: {
    maxTitleLength: 100,
    maxContentLength: 10000
  },
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
}
