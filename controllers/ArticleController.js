const BaseRepository = require('../repositories/BaseRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const response = require('../utils/response');
const utils = require('../utils/utils');
const repositoryHelper = require('../utils/repositoryHelper');
const sequelizeUtils = require('../utils/sequelizeUtils');
const ArticleController = () => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await BaseRepository.findById(id);
      if (!article) {
        return next(new Error('Article not found'));
      }
      const details = ['title', 'description', 'created_at'].map(key => {
        let value = article[key];
        if (value && typeof value === 'string' && value.length > 100) {
          value = utils.trimText(value, 100);
        }
        return { key, value };
      });
      return response(res).success({ details });
    } catch (err) {
      return next(err);
    }
  };
  const getArticles = async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const articles = await ArticleRepository.getArticles(page);
      const paginatedArticles = repositoryHelper.paginate(articles, page, 10);
      const formattedArticles = paginatedArticles.map(article => {
        return {
          title: sequelizeUtils.trimText(article.title, 2),
          description: sequelizeUtils.trimText(article.description, 2),
          created_at: article.created_at
        }
      });
      return response(res)
        .success({
          items: formattedArticles,
          totalItems: articles.length,
          totalPages: Math.ceil(articles.length / 10)
        })
    } catch (err) {
      next(err)
    }
  }
  return {
    getArticleDetails,
    getArticles
  };
};
module.exports = ArticleController;
