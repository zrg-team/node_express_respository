const status = require('http-status');
const ApiError = require('../utils/api-error');

// New utility function to format success response for entity creation
const createdResponse = (res, data) => {
  return res.status(status.CREATED).json({
    success: true,
    article: data
  });
};

module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true';

  const updateArticleSuccess = (article) => {
    return res
      .status(status.OK)
      .json({ status: status.OK, article });
  };

  const articlesSuccess = (data, total_pages, limit, page) => {
    return res
      .status(status.OK)
      .json({
        status: status.OK,
        articles: data,
        total_pages,
        limit,
        page
      });
  };

  const success = (data) => {
    return res
      .status(200)
      .json({ success: true, ...data });
  };

  const error = (err) => {
    if (err instanceof ApiError && err.status === status.BAD_REQUEST) {
      return res.status(err.status).json({ success: false, errors: err.message });
    }
    let msg = 'Internal server error';
    let code = status.INTERNAL_SERVER_ERROR;
    if (isDebug) {
      if (status[err.status]) {
        code = err.status;
      }
      msg = err.stack || err;
    }
    return res
      .status(code)
      .json({ success: false, msg });
  };

  return {
    updateArticleSuccess,
    articlesSuccess,
    success,
    error,
    // Expose the createdResponse function
    created: createdResponse
  };
};
