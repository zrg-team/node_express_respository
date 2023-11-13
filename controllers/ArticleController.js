// PATH: /controllers/ArticleController.js
const BaseRepository = require('../repositories/BaseRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const response = require('../utils/response');
const utils = require('../utils/utils');
const repositoryHelper = require('../utils/repositoryHelper');
const sequelizeUtils = require('../utils/sequelizeUtils');
const ApiError = require('../utils/ApiError');
const ArticleController = () => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).send({ error: 'Wrong format.' });
      }
      const article = await ArticleRepository.findById(id);
      if (!article) {
        throw new ApiError('This article is not found', 404);
      }
      const details = {
        id: article.id,
        title: article.title,
        description: article.description,
        created_at: article.created_at
      };
      return response(res).success({ article: details });
    } catch (err) {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).send({ error: err.message });
      }
      return next(err);
    }
  };
  return {
    getArticleDetails,
  };
};
module.exports = ArticleController;
