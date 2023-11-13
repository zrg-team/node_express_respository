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
      const article = await BaseRepository.findById(id);
      if (!article) {
        throw new ApiError('This article is not found', 404);
      }
      const details = ['title', 'description', 'created_at'].map(key => {
        let value = article[key];
        if (value && typeof value === 'string' && value.length > 100) {
          value = utils.trimText(value, 100);
        }
        return { key, value };
      });
      return response(res).success({ article: details });
    } catch (err) {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).send({ error: err.message });
      }
      return next(err);
    }
  };
  const getArticles = async (req, res, next) => {
    try {
      let page = req.query.page || 1;
      let limit = req.query.limit || 10;
      // Validate input parameters
      if (isNaN(page) || isNaN(limit)) {
        return res.status(422).json({ message: 'Wrong format.' });
      }
      page = Number(page);
      limit = Number(limit);
      if (page < 1) {
        return res.status(422).json({ message: 'Page must be greater than 0.' });
      }
      const articles = await ArticleRepository.getArticles(page, limit);
      const paginatedArticles = repositoryHelper.paginate(articles, page, limit);
      const formattedArticles = paginatedArticles.map(article => {
        return {
          id: article.id,
          title: sequelizeUtils.trimText(article.title, 2),
          description: sequelizeUtils.trimText(article.description, 2),
          created_at: article.created_at
        }
      });
      return response(res)
        .success({
          status: 200,
          articles: formattedArticles,
          total_pages: Math.ceil(articles.length / limit),
          limit: limit,
          page: page
        })
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  return {
    getArticleDetails,
    getArticles
  };
};
module.exports = ArticleController;
