
const status = require('http-status')
const ApiError = require('../utils/api-error')

function formatArticleList(articles) {
  return articles.map(article => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    publication_date: article.publication_date,
    author_id: article.user_id
  }));
}

module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    success: (data) => {
      return res
        .status(200)
        .json({ success: true, data: formatArticleList(data) })
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
    }
  }
}
