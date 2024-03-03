const status = require('http-status');
const { i18n } = require('../config/index');
const ApiError = require('../utils/api-error');

const assignArticleToCategorySuccess = (res, article_id, category_id) => {
  return res.status(status.OK).json({
    success: true,
    message: i18n.__('Article assigned to category successfully.'),
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
        .json({ success: true, message: i18n.__('SUCCESS'), ...data });
    },
    error: (err) => {
      if (err instanceof ApiError) {
        if (err.status === status.BAD_REQUEST) {
          return res.status(err.status).json({ success: false, errors: i18n.__(err.message) });
        }
        let msg = i18n.__('Internal server error');
        let code = status.INTERNAL_SERVER_ERROR;
        if (isDebug) {
          if (status[err.status]) {
            code = err.status;
          }
          msg = i18n.__(err.stack || 'ERROR_INTERNAL_SERVER');
        }
        return res
          .status(code)
          .json({ success: false, message: msg });
      }
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
