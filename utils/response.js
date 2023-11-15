const status = require('http-status')
const ApiError = require('../utils/api-error')
const util = require('./util')
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
        .json({ success: false, msg })
    },
    sendReadArticleResponse: (user_id, article_id, read_at) => {
      const data = {
        message: 'Article read successfully',
        user_id: user_id,
        article_id: article_id,
        read_at: util.formatDate(read_at)
      }
      return res
        .status(200)
        .json({ success: true, ...data })
    }
  }
}
