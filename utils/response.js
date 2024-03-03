
const status = require('http-status')
const ApiError = require('../utils/api-error')

// Function to format paginated responses for the articles list endpoint
function formatArticleListResponse(data, totalItems, totalPages) {
  return {
    articles: data,
    total_count: totalItems,
    total_pages: totalPages
  };
}

module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    success: (data, isPaginated = false) => {
      // Check if the response should be paginated
      if (isPaginated) {
        const { docs, totalDocs, totalPages } = data;
        data = formatArticleListResponse(docs, totalDocs, totalPages);
      }
      return res
        .status(status.OK)
        .json({ success: true, ...data })
    },
    // Function to handle errors and format error responses
    error: (err) => {
      if (err instanceof ApiError && err.status === status.BAD_REQUEST) {
        return res.status(err.status).json({ success: false, errors: err.message })
      }
      let msg = 'Internal server error'
      let code = status.INTERNAL_SERVER_ERROR
      if (isDebug) {
        // Include stack trace if in debug mode
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
