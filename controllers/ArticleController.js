const ArticleRepository = require('../repositories/ArticleRepository')
const auth = require('../utils/auth')
const repositoryHelper = require('../utils/repositoryHelper')
const ApiError = require('../utils/api-error')
const helper = require('../utils/helper')
const authUtils = require('../utils/auth.utils')
class ArticleController {
  ...
  async getArticles(req, res, next) {
    try {
      const { user_id, page } = req.params;
      if (isNaN(user_id)) {
        throw new ApiError(400, 'Wrong format.')
      }
      auth.verify(req, res, next);
      let articles = await ArticleRepository.getArticles(user_id);
      if (!articles) {
        throw new ApiError(404, 'This article is not found')
      }
      articles = articles.sort((a, b) => b.created_at - a.created_at);
      const totalItems = articles.length;
      const totalPages = Math.ceil(totalItems / 10);
      articles = repositoryHelper.paginate(articles, page, 10);
      articles = articles.map(article => {
        return {
          title: helper.trimToLines(article.title, 2),
          description: helper.trimToLines(article.description, 2),
          created_at: article.created_at
        }
      });
      res.status(200).json({
        status: 200,
        articles: articles,
        totalItems: totalItems,
        totalPages: totalPages
      })
    } catch (err) {
      if (err instanceof ApiError) {
        next(err)
      } else {
        next(new ApiError(500, err.message))
      }
    }
  }
  async getArticleDetails(req, res, next) {
    try {
      const { user_id, article_id } = req.params;
      if (isNaN(user_id) || isNaN(article_id)) {
        throw new ApiError(400, 'Wrong format.')
      }
      const user = authUtils.verify(user_id)
      if (!user) {
        throw new ApiError(401, 'Unauthorized')
      }
      const article = await ArticleRepository.getArticle(user_id, article_id)
      if (!article) {
        throw new ApiError(404, 'This article is not found')
      }
      if (article.user_id !== user_id) {
        throw new ApiError(403, 'Forbidden')
      }
      res.status(200).json({
        status: 200,
        article: {
          title: article.title,
          description: article.description,
          created_at: article.created_at
        }
      })
    } catch (err) {
      if (err instanceof ApiError) {
        next(err)
      } else {
        next(new ApiError(500, err.message))
      }
    }
  }
  ...
}
module.exports = new ArticleController()
