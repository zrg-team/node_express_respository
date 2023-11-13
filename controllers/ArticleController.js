// PATH: /controllers/ArticleController.js
const ArticleRepository = require('../repositories/ArticleRepository');
const response = require('../utils/response');
const util = require('../utils/util');
const ApiError = require('../utils/api-error');
const status = require('http-status');
const ArticleController = () => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      let article = await ArticleRepository.findById(id);
      if (!article) {
        return next(new ApiError('Article not found', status.NOT_FOUND));
      }
      article.title = util.trimLongText(article.title);
      article.description = util.trimLongText(article.description);
      return response(res).success({
        title: article.title,
        description: article.description,
        created_at: article.created_at
      });
    } catch (err) {
      return next(err);
    }
  };
  return {
    getArticleDetails,
  };
};
module.exports = ArticleController;
