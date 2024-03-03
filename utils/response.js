
const status = require('http-status')
const i18n = require('i18n')
const ApiError = require('../utils/api-error')

module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    success: (data) => {
      return res
        .status(200)
        .json({ success: true, ...data })
    },
    error: (err) => {
      if (err instanceof ApiError && err.status === status.BAD_REQUEST) {
        return res.status(err.status).json({ success: false, errors: err.message })
      }
      let msg = i18n.__('INTERNAL_SERVER_ERROR')
      let code = status.INTERNAL_SERVER_ERROR
      if (isDebug) {
        if (status[err.status]) {
          code = err.status
        }
        msg = err.stack || err
      } else {
        msg = i18n.__('ERROR_PROCESSING_REQUEST')
      }
      return res
        .status(code)
        .json({ success: false, msg })
    }
  }
}
