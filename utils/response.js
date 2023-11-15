const status = require('http-status')
const ApiError = require('../utils/api-error')
const util = require('./util')
module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    success: (data, totalItems, totalPages) => {
      const pagination = totalPages > 1 ? { totalItems, totalPages } : undefined;
      return res
        .status(200)
        .json({ success: true, data, pagination })
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
    sendReadArticleResponse: (article) => {
      const data = {
        status: 200,
        article: {
          id: article.id,
          title: article.title,
          content: article.content,
          author_id: article.author_id,
          created_at: util.formatDate(article.created_at)
        }
      }
      return res
        .status(200)
        .json(data)
    },
    sendArticleResponse: (article) => {
      return res
        .status(200)
        .json({ success: true, data: article })
    }
  }
}
