const status = require('http-status')
const ApiError = require('../utils/api-error')
module.exports = (res = {}, pagination = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    success: (data) => {
      return res
        .status(200)
        .json({ 
          success: true, 
          ...data,
          total_pages: pagination.total_pages || null,
          limit: pagination.limit || null,
          current_page: pagination.current_page || null
        })
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
    sendArticleList: (articles, totalItems, totalPages) => {
      return res
        .status(200)
        .json({
          success: true,
          articles: articles.map(article => ({
            title: article.title.length > 50 ? `${article.title.substring(0, 50)}...` : article.title,
            description: article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description,
            created_at: article.created_at
          })),
          total_items: totalItems,
          total_pages: totalPages
        })
    }
  }
}
