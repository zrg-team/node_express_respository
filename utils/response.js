const status = require('http-status');
const ApiError = require('../utils/api-error');

const assignArticleToCategorySuccess = (res, article_id, category_id) => {
  return res.status(status.OK).json({
    success: true,
    message: 'Article assigned to category successfully.',
    article_id,
    category_id
  });
};

module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true';
  return {
    success: (data) => {
      return res
        .status(status.OK)
        .json({ success: true, ...data });
    },
    error: (err) => {
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
    },
    commentCreated: (comment) => {
      return res
        .status(status.CREATED)
        .json({
          status: status.CREATED,
          comment: {
            id: comment.id,
            article_id: comment.article_id,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at
          }
        });
    },
    assignArticleToCategorySuccess: assignArticleToCategorySuccess
  };
};
