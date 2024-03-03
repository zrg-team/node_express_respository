
const status = require('http-status')
const ApiError = require('../utils/api-error')

// Function to format paginated responses for the articles list endpoint
function formatPaginatedResponse(data) {
  return {
    status: status.OK,
    data: data.docs,
    total_items: data.totalDocs,
    total_pages: data.totalPages,
    limit: data.limit,
    page: data.page
    // Add any other necessary pagination details here
  };
}

module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    success: (data, isPaginated = false) => {
      // Check if the response should be paginated
      if (isPaginated) {
        data = formatPaginatedResponse(data);
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
