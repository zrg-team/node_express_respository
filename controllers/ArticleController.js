const ArticleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const repositoryHelper = require('../utils/repositoryHelper')
const sequelizeUtils = require('../utils/sequelizeUtils')
const ArticleController = () => {
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
    getArticles
  }
}
module.exports = ArticleController
