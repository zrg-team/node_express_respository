
const status = require('http-status');
const { i18n } = require('../config').i18n;
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
          msg = err.stack || err;
        }
        return res
          .status(code)
          .json({ success: false, message: msg });
      }
    },
    commentPostedSuccess: (comment) => {
      return res
        .status(status.CREATED)
        .json({
          success: true,
          message: i18n.__('Comment has been posted successfully.'),
          comment_id: comment.id
        });
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
    registrationSuccess: (user) => {
      return res
        .status(status.CREATED)
        .json({
          success: true,
          message: i18n.__('User has been registered successfully.'),
          user: { id: user.id, name: user.name },
          note: i18n.__('A confirmation email has been sent to your email address.')
        })
    },
    assignArticleToCategorySuccess: assignArticleToCategorySuccess
  };
};
