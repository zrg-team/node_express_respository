const status = require('http-status')
const ApiError = require('../utils/api-error')
module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    successResponse: (message, data) => {
      return res
        .status(200)
        .json({ success: true, message, data })
    },
    errorResponse: (message, err = null) => {
      if (err instanceof ApiError && err.status === status.BAD_REQUEST) {
        return res.status(err.status).json({ success: false, message, errors: err.message })
      }
      let msg = 'Internal server error'
      let code = status.INTERNAL_SERVER_ERROR
      if (isDebug) {
        if (status[err.status]) {
          code = err.status
        }
        msg = err.stack || err
      }
      return res
        .status(code)
        .json({ success: false, message: message || msg })
    },
    ...otherMethods
  }
}
